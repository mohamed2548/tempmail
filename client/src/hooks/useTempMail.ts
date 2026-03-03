/**
 * Dark Industrial Design - TempMail Hook
 * Manages temporary email creation, message fetching via mail.tm API
 * Supports custom usernames and unlimited aliases
 */
import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = 'https://api.mail.tm';

interface Domain {
  id: string;
  domain: string;
  isActive: boolean;
}

interface MessageFrom {
  address: string;
  name: string;
}

interface MessagePreview {
  id: string;
  from: MessageFrom;
  subject: string;
  intro: string;
  createdAt: string;
  seen: boolean;
  hasAttachments: boolean;
}

interface MessageFull extends MessagePreview {
  text: string;
  html: string[];
  to: MessageFrom[];
  cc: MessageFrom[];
  bcc: MessageFrom[];
}

export interface AliasAccount {
  id: string;
  email: string;
  password: string;
  token: string;
  createdAt: string;
  messageCount: number;
  isActive: boolean;
}

interface TempMailState {
  email: string;
  password: string;
  token: string;
  accountId: string;
  domain: string;
  messages: MessagePreview[];
  selectedMessage: MessageFull | null;
  isLoading: boolean;
  isCreating: boolean;
  isFetchingMessages: boolean;
  error: string | null;
  autoRefresh: boolean;
  aliases: AliasAccount[];
  activeAliasId: string;
}

const generateRandomString = (length: number): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generatePassword = (): string => {
  return generateRandomString(16) + 'A1!';
};

const generateId = (): string => {
  return Date.now().toString(36) + generateRandomString(4);
};

export function useTempMail() {
  const [state, setState] = useState<TempMailState>({
    email: '',
    password: '',
    token: '',
    accountId: '',
    domain: '',
    messages: [],
    selectedMessage: null,
    isLoading: true,
    isCreating: false,
    isFetchingMessages: false,
    error: null,
    autoRefresh: true,
    aliases: [],
    activeAliasId: '',
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tokenRef = useRef<string>('');
  const domainRef = useRef<string>('');

  // Keep refs in sync
  useEffect(() => {
    tokenRef.current = state.token;
  }, [state.token]);

  useEffect(() => {
    domainRef.current = state.domain;
  }, [state.domain]);

  const fetchDomains = useCallback(async (): Promise<Domain[]> => {
    const res = await fetch(`${API_BASE}/domains`);
    if (!res.ok) throw new Error('فشل في جلب النطاقات المتاحة');
    const data = await res.json();
    return data['hydra:member'] || [];
  }, []);

  const createAccountAPI = useCallback(async (address: string, password: string) => {
    const res = await fetch(`${API_BASE}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, password }),
    });
    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('تم تجاوز الحد المسموح - انتظر بضع ثوانٍ ثم حاول مرة أخرى');
      }
      if (res.status === 422) {
        throw new Error('اسم المستخدم هذا مستخدم بالفعل - جرب اسماً آخر');
      }
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData['hydra:description'] || errData.detail || 'فشل في إنشاء الحساب';
      throw new Error(errMsg);
    }
    return res.json();
  }, []);

  const getToken = useCallback(async (address: string, password: string): Promise<string> => {
    const res = await fetch(`${API_BASE}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, password }),
    });
    if (!res.ok) throw new Error('فشل في الحصول على رمز المصادقة');
    const data = await res.json();
    return data.token;
  }, []);

  const fetchMessages = useCallback(async (token?: string) => {
    const currentToken = token || tokenRef.current;
    if (!currentToken) return;

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (!res.ok) throw new Error('فشل في جلب الرسائل');
      const data = await res.json();
      const messages = data['hydra:member'] || [];
      setState(prev => {
        // Update message count for active alias
        const updatedAliases = prev.aliases.map(a =>
          a.id === prev.activeAliasId ? { ...a, messageCount: messages.length } : a
        );
        return { ...prev, messages, isFetchingMessages: false, aliases: updatedAliases };
      });
    } catch {
      setState(prev => ({ ...prev, isFetchingMessages: false }));
    }
  }, []);

  const fetchMessageDetails = useCallback(async (messageId: string) => {
    if (!tokenRef.current) return;

    try {
      const res = await fetch(`${API_BASE}/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${tokenRef.current}` },
      });
      if (!res.ok) throw new Error('فشل في جلب تفاصيل الرسالة');
      const data = await res.json();
      setState(prev => ({ ...prev, selectedMessage: data }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message }));
    }
  }, []);

  const clearSelectedMessage = useCallback(() => {
    setState(prev => ({ ...prev, selectedMessage: null }));
  }, []);

  const startAutoRefresh = useCallback((token: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      fetchMessages(token);
    }, 5000);
  }, [fetchMessages]);

  // Create a new email account (random or custom username)
  const createNewAlias = useCallback(async (customUsername?: string, retryCount = 0) => {
    setState(prev => ({ ...prev, isCreating: true, error: null }));

    try {
      let domain = domainRef.current;

      // Fetch domain if not available
      if (!domain) {
        const domains = await fetchDomains();
        const activeDomain = domains.find(d => d.isActive);
        if (!activeDomain) throw new Error('لا توجد نطاقات متاحة حالياً');
        domain = activeDomain.domain;
      }

      const username = customUsername?.trim().toLowerCase() || generateRandomString(12);

      // Validate username
      if (customUsername) {
        if (!/^[a-z0-9][a-z0-9._-]*[a-z0-9]$/.test(username) && username.length > 1) {
          throw new Error('اسم المستخدم يجب أن يحتوي فقط على أحرف إنجليزية صغيرة وأرقام ونقاط وشرطات');
        }
        if (username.length < 1) {
          throw new Error('اسم المستخدم يجب أن يكون حرفاً واحداً على الأقل');
        }
        if (username.length > 64) {
          throw new Error('اسم المستخدم طويل جداً (الحد الأقصى 64 حرفاً)');
        }
      }

      const address = `${username}@${domain}`;
      const password = generatePassword();

      try {
        await createAccountAPI(address, password);
      } catch (apiErr: any) {
        // Auto-retry on rate limit (429) up to 3 times with increasing delay
        if (apiErr.message.includes('تم تجاوز') && retryCount < 3) {
          await new Promise(r => setTimeout(r, (retryCount + 1) * 2000));
          return createNewAlias(customUsername, retryCount + 1);
        }
        throw apiErr;
      }
      const token = await getToken(address, password);

      const aliasId = generateId();
      const newAlias: AliasAccount = {
        id: aliasId,
        email: address,
        password,
        token,
        createdAt: new Date().toISOString(),
        messageCount: 0,
        isActive: true,
      };

      setState(prev => {
        // Mark previous active alias as inactive
        const updatedAliases = prev.aliases.map(a => ({ ...a, isActive: false }));
        return {
          ...prev,
          email: address,
          password,
          token,
          domain,
          messages: [],
          selectedMessage: null,
          isLoading: false,
          isCreating: false,
          error: null,
          aliases: [...updatedAliases, { ...newAlias, isActive: true }],
          activeAliasId: aliasId,
        };
      });

      startAutoRefresh(token);
      return address;

    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isCreating: false,
        error: err.message || 'حدث خطأ غير متوقع',
      }));
      return null;
    }
  }, [fetchDomains, createAccountAPI, getToken, startAutoRefresh]);

  // Switch to an existing alias
  const switchToAlias = useCallback(async (aliasId: string) => {
    setState(prev => {
      const alias = prev.aliases.find(a => a.id === aliasId);
      if (!alias) return prev;

      const updatedAliases = prev.aliases.map(a => ({
        ...a,
        isActive: a.id === aliasId,
      }));

      return {
        ...prev,
        email: alias.email,
        password: alias.password,
        token: alias.token,
        messages: [],
        selectedMessage: null,
        aliases: updatedAliases,
        activeAliasId: aliasId,
      };
    });

    // Get the alias to start refresh
    const alias = state.aliases.find(a => a.id === aliasId);
    if (alias) {
      tokenRef.current = alias.token;
      startAutoRefresh(alias.token);
      fetchMessages(alias.token);
    }
  }, [state.aliases, startAutoRefresh, fetchMessages]);

  // Remove an alias
  const removeAlias = useCallback((aliasId: string) => {
    setState(prev => {
      const filtered = prev.aliases.filter(a => a.id !== aliasId);
      // If removing active alias, switch to the last one
      if (prev.activeAliasId === aliasId && filtered.length > 0) {
        const lastAlias = filtered[filtered.length - 1];
        const updatedFiltered = filtered.map(a => ({
          ...a,
          isActive: a.id === lastAlias.id,
        }));
        tokenRef.current = lastAlias.token;
        startAutoRefresh(lastAlias.token);
        fetchMessages(lastAlias.token);
        return {
          ...prev,
          email: lastAlias.email,
          password: lastAlias.password,
          token: lastAlias.token,
          messages: [],
          selectedMessage: null,
          aliases: updatedFiltered,
          activeAliasId: lastAlias.id,
        };
      }
      return { ...prev, aliases: filtered };
    });
  }, [startAutoRefresh, fetchMessages]);

  const initializeEmail = useCallback(async () => {
    await createNewAlias();
  }, [createNewAlias]);

  const generateNewEmail = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    await createNewAlias();
  }, [createNewAlias]);

  const createCustomEmail = useCallback(async (username: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    return await createNewAlias(username);
  }, [createNewAlias]);

  const toggleAutoRefresh = useCallback(() => {
    setState(prev => {
      const newAutoRefresh = !prev.autoRefresh;
      if (!newAutoRefresh && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else if (newAutoRefresh && prev.token) {
        startAutoRefresh(prev.token);
      }
      return { ...prev, autoRefresh: newAutoRefresh };
    });
  }, [startAutoRefresh]);

  const deleteMessage = useCallback(async (messageId: string) => {
    if (!tokenRef.current) return;
    try {
      await fetch(`${API_BASE}/messages/${messageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${tokenRef.current}` },
      });
      setState(prev => ({
        ...prev,
        messages: prev.messages.filter(m => m.id !== messageId),
        selectedMessage: prev.selectedMessage?.id === messageId ? null : prev.selectedMessage,
      }));
    } catch {
      // silently fail
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeEmail();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    ...state,
    generateNewEmail,
    createCustomEmail,
    fetchMessages,
    fetchMessageDetails,
    clearSelectedMessage,
    toggleAutoRefresh,
    deleteMessage,
    switchToAlias,
    removeAlias,
  };
}
