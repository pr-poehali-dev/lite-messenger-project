import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

type User = {
  phone: string;
  avatar: string;
  nickname: string;
  username: string;
  isPremium: boolean;
};

type Message = {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  status: 'sending' | 'sent' | 'read';
};

type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  type: 'direct' | 'group' | 'channel';
  isOnline?: boolean;
};

type Contact = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
};

const EMOJI_AVATARS = ['😊', '🚀', '🎨', '🎮', '🎵', '⚡', '🌟', '🔥', '💎', '🎯', '🌈', '🦄'];

const Index = () => {
  const [step, setStep] = useState<'auth' | 'phone' | 'avatar' | 'nickname' | 'main'>('auth');
  const [registrationData, setRegistrationData] = useState({
    phone: '',
    avatar: '',
    nickname: '',
    username: ''
  });
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showNewChannel, setShowNewChannel] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<'sbp' | 'card' | 'premium'>('sbp');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chats] = useState<Chat[]>([]);
  
  const [contacts] = useState<Contact[]>([
    { id: '1', name: 'Анна Смирнова', username: '@anna_sm', avatar: '👩', isOnline: true },
    { id: '2', name: 'Дмитрий Козлов', username: '@dmitry_k', avatar: '👨', isOnline: false },
    { id: '3', name: 'Мария Петрова', username: '@maria_p', avatar: '👧', isOnline: true },
  ]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const startRegistration = () => setStep('phone');
  const startLogin = () => {
    if (user) {
      setStep('main');
    }
  };

  const handlePhoneSubmit = () => {
    if (registrationData.phone.length >= 10) setStep('avatar');
  };

  const handleAvatarSelect = (avatar: string, isEmoji: boolean) => {
    setRegistrationData({ ...registrationData, avatar: isEmoji ? avatar : '📷' });
    setStep('nickname');
  };

  const handleNicknameSubmit = () => {
    if (registrationData.nickname && registrationData.username) {
      const newUser: User = {
        phone: registrationData.phone,
        avatar: registrationData.avatar,
        nickname: registrationData.nickname,
        username: registrationData.username,
        isPremium: false
      };
      setUser(newUser);
      setStep('main');
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageInput,
        sender: 'me',
        timestamp: new Date(),
        status: 'sending'
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'sent' as const } : msg
        ));
      }, 500);

      setTimeout(() => {
        setIsTyping(true);
      }, 1000);

      setTimeout(() => {
        setIsTyping(false);
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Привет! Это автоответ 👋',
          sender: 'other',
          timestamp: new Date(),
          status: 'read'
        };
        setMessages(prev => [...prev, reply]);
      }, 3000);
    }
  };

  const openChat = (chat: Chat) => {
    setSelectedChat(chat);
    setMessages([
      { id: '1', text: 'Привет!', sender: 'other', timestamp: new Date(), status: 'read' },
      { id: '2', text: 'Как дела?', sender: 'me', timestamp: new Date(), status: 'read' }
    ]);
  };

  const startCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setShowCall(true);
  };

  const processPayment = () => {
    alert(`Оплата через ${paymentType === 'sbp' ? 'СБП' : paymentType === 'card' ? 'карту' : 'Premium подписку'} выполнена успешно!`);
    if (paymentType === 'premium' && user) {
      setUser({ ...user, isPremium: true });
    }
    setShowPayment(false);
  };

  if (step === 'auth') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6 border-0 shadow-xl">
          <div className="text-6xl mb-4">💬</div>
          <h1 className="text-4xl font-bold text-gray-900">Lites</h1>
          <p className="text-gray-500">Минималистичный мессенджер</p>
          <div className="space-y-3 pt-4">
            <Button onClick={startRegistration} className="w-full h-12 text-base" size="lg">
              Регистрация
            </Button>
            <Button onClick={startLogin} variant="outline" className="w-full h-12 text-base" size="lg">
              Вход в аккаунт
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6 border-0 shadow-xl">
          <div className="text-center">
            <div className="text-5xl mb-4">📱</div>
            <h2 className="text-2xl font-bold text-gray-900">Ваш номер</h2>
            <p className="text-gray-500 mt-2">Шаг 1 из 3</p>
          </div>
          <Input
            type="tel"
            placeholder="+7 (999) 123-45-67"
            value={registrationData.phone}
            onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
            className="h-12 text-base"
          />
          <Button onClick={handlePhoneSubmit} className="w-full h-12 text-base" disabled={registrationData.phone.length < 10}>
            Продолжить
          </Button>
        </Card>
      </div>
    );
  }

  if (step === 'avatar') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6 border-0 shadow-xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Выберите аватар</h2>
            <p className="text-gray-500 mt-2">Шаг 2 из 3</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {EMOJI_AVATARS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleAvatarSelect(emoji, true)}
                className="text-5xl hover:scale-110 transition-transform p-4 rounded-xl hover:bg-gray-50"
              >
                {emoji}
              </button>
            ))}
          </div>
          <Button variant="outline" className="w-full h-12 text-base" onClick={() => handleAvatarSelect('📷', false)}>
            <Icon name="Upload" className="mr-2" size={20} />
            Загрузить фото
          </Button>
        </Card>
      </div>
    );
  }

  if (step === 'nickname') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6 border-0 shadow-xl">
          <div className="text-center">
            <div className="text-5xl mb-4">{registrationData.avatar}</div>
            <h2 className="text-2xl font-bold text-gray-900">О вас</h2>
            <p className="text-gray-500 mt-2">Шаг 3 из 3</p>
          </div>
          <div className="space-y-4">
            <Input
              placeholder="Никнейм"
              value={registrationData.nickname}
              onChange={(e) => setRegistrationData({ ...registrationData, nickname: e.target.value })}
              className="h-12 text-base"
            />
            <Input
              placeholder="Юзернейм (@username)"
              value={registrationData.username}
              onChange={(e) => setRegistrationData({ ...registrationData, username: e.target.value })}
              className="h-12 text-base"
            />
          </div>
          <Button 
            onClick={handleNicknameSubmit} 
            className="w-full h-12 text-base"
            disabled={!registrationData.nickname || !registrationData.username}
          >
            Завершить
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="w-20 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-6 space-y-6">
        <div className="text-2xl font-bold text-gray-900 cursor-pointer hover:scale-110 transition-transform">L</div>
        
        <button
          onClick={() => setActiveTab('chats')}
          className={`p-3 rounded-xl transition-all hover:bg-gray-200 ${activeTab === 'chats' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
        >
          <Icon name="MessageSquare" size={24} />
        </button>
        
        <button
          onClick={() => setActiveTab('contacts')}
          className={`p-3 rounded-xl transition-all hover:bg-gray-200 ${activeTab === 'contacts' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
        >
          <Icon name="Users" size={24} />
        </button>
        
        <button
          onClick={() => setActiveTab('groups')}
          className={`p-3 rounded-xl transition-all hover:bg-gray-200 ${activeTab === 'groups' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
        >
          <Icon name="Users2" size={24} />
        </button>
        
        <button
          onClick={() => setActiveTab('channels')}
          className={`p-3 rounded-xl transition-all hover:bg-gray-200 ${activeTab === 'channels' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
        >
          <Icon name="Radio" size={24} />
        </button>
        
        <button
          onClick={() => setActiveTab('payments')}
          className={`p-3 rounded-xl transition-all hover:bg-gray-200 ${activeTab === 'payments' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
        >
          <Icon name="CreditCard" size={24} />
        </button>
        
        <div className="flex-1" />
        
        <button
          onClick={() => setActiveTab('settings')}
          className={`p-3 rounded-xl transition-all hover:bg-gray-200 ${activeTab === 'settings' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
        >
          <Icon name="Settings" size={24} />
        </button>
        
        <button
          onClick={() => setActiveTab('profile')}
          className="text-3xl hover:scale-110 transition-transform"
        >
          {user?.avatar}
        </button>
      </div>

      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeTab === 'chats' && 'Чаты'}
            {activeTab === 'contacts' && 'Контакты'}
            {activeTab === 'groups' && 'Группы'}
            {activeTab === 'channels' && 'Каналы'}
            {activeTab === 'payments' && 'Платежи'}
            {activeTab === 'settings' && 'Настройки'}
            {activeTab === 'profile' && 'Профиль'}
          </h2>
          <Input placeholder="Поиск..." className="mt-4" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'chats' && (
            <div className="p-2">
              {chats.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-30" />
                  <p>Нет чатов</p>
                  <p className="text-sm mt-2">Начните общение из контактов</p>
                </div>
              ) : (
                chats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => openChat(chat)}
                    className="w-full p-4 hover:bg-gray-50 rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="text-3xl">{chat.avatar}</div>
                        {chat.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-gray-900 truncate">{chat.name}</p>
                          <span className="text-xs text-gray-400">{chat.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <div className="bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="p-2">
              {contacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => openChat({
                    id: contact.id,
                    name: contact.name,
                    avatar: contact.avatar,
                    lastMessage: '',
                    timestamp: 'сейчас',
                    unread: 0,
                    type: 'direct',
                    isOnline: contact.isOnline
                  })}
                  className="w-full p-4 hover:bg-gray-50 rounded-xl text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="text-3xl">{contact.avatar}</div>
                      {contact.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.username}</p>
                    </div>
                  </div>
                </button>
              ))}
              <Button onClick={() => alert('Добавить контакт')} variant="outline" className="w-full mt-4 mx-2">
                <Icon name="UserPlus" className="mr-2" size={20} />
                Добавить контакт
              </Button>
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="p-4 text-center">
              <Icon name="Users2" size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">Нет групп</p>
              <Button onClick={() => setShowNewGroup(true)} className="w-full">
                <Icon name="Plus" className="mr-2" size={20} />
                Создать группу
              </Button>
            </div>
          )}

          {activeTab === 'channels' && (
            <div className="p-4 text-center">
              <Icon name="Radio" size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">Нет каналов</p>
              <Button onClick={() => setShowNewChannel(true)} className="w-full">
                <Icon name="Plus" className="mr-2" size={20} />
                Создать канал
              </Button>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="p-4 space-y-3">
              <Button 
                onClick={() => { setPaymentType('sbp'); setShowPayment(true); }}
                variant="outline" 
                className="w-full h-16 justify-start text-left"
              >
                <Icon name="Smartphone" className="mr-3" size={24} />
                <div>
                  <div className="font-semibold">Оплата через СБП</div>
                  <div className="text-xs text-gray-500">Быстрые платежи</div>
                </div>
              </Button>
              <Button 
                onClick={() => { setPaymentType('card'); setShowPayment(true); }}
                variant="outline" 
                className="w-full h-16 justify-start text-left"
              >
                <Icon name="CreditCard" className="mr-3" size={24} />
                <div>
                  <div className="font-semibold">Оплата картой</div>
                  <div className="text-xs text-gray-500">Visa, Mastercard, МИР</div>
                </div>
              </Button>
            </div>
          )}

          {activeTab === 'profile' && user && (
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">{user.avatar}</div>
                <h3 className="text-xl font-bold text-gray-900">{user.nickname}</h3>
                <p className="text-gray-500">{user.username}</p>
                <p className="text-sm text-gray-400 mt-2">{user.phone}</p>
                {user.isPremium && (
                  <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                    <Icon name="Crown" size={16} />
                    Premium
                  </div>
                )}
              </div>
              {!user.isPremium && (
                <Button 
                  onClick={() => { setPaymentType('premium'); setShowPayment(true); }}
                  className="w-full h-12 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                >
                  <Icon name="Crown" className="mr-2" size={20} />
                  Купить Premium — 350₽
                </Button>
              )}
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="User" className="mr-3" size={20} />
                  Редактировать профиль
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Bell" className="mr-3" size={20} />
                  Уведомления
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Lock" className="mr-3" size={20} />
                  Приватность
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 space-y-2">
              <Button variant="outline" className="w-full justify-start h-12">
                <Icon name="Palette" className="mr-3" size={20} />
                Тема оформления
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Icon name="Globe" className="mr-3" size={20} />
                Язык интерфейса
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Icon name="Database" className="mr-3" size={20} />
                Хранилище данных
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Icon name="HelpCircle" className="mr-3" size={20} />
                Помощь
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="text-3xl">{selectedChat.avatar}</div>
                  {selectedChat.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                  <p className="text-xs text-gray-500">{selectedChat.isOnline ? 'онлайн' : 'был(а) недавно'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => startCall('audio')} className="hover:bg-gray-100">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => startCall('video')} className="hover:bg-gray-100">
                  <Icon name="Video" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-md px-4 py-3 rounded-2xl ${
                    msg.sender === 'me' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-white text-gray-900 border border-gray-200'
                  } ${msg.status === 'sending' ? 'opacity-60' : ''} hover:scale-[1.02] transition-transform`}>
                    <p className="text-sm">{msg.text}</p>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <span className="text-xs opacity-60">
                        {msg.timestamp.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.sender === 'me' && (
                        <Icon 
                          name={msg.status === 'read' ? 'CheckCheck' : 'Check'} 
                          size={14} 
                          className={msg.status === 'read' ? 'text-blue-400' : ''} 
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Icon name="Paperclip" size={20} />
                </Button>
                <Input
                  placeholder="Сообщение"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 h-11"
                />
                <Button 
                  onClick={sendMessage} 
                  size="icon"
                  disabled={!messageInput.trim()}
                  className="hover:scale-110 transition-transform"
                >
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Icon name="MessageSquare" size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">Выберите чат</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showCall} onOpenChange={setShowCall}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{callType === 'video' ? 'Видеозвонок' : 'Аудиозвонок'}</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">{selectedChat?.avatar}</div>
            <h3 className="text-xl font-semibold mb-2">{selectedChat?.name}</h3>
            <p className="text-gray-500 mb-6">Соединяем...</p>
            {callType === 'video' && (
              <div className="w-full h-48 bg-gray-900 rounded-xl mb-6 flex items-center justify-center">
                <Icon name="Video" size={48} className="text-gray-600" />
              </div>
            )}
            <div className="flex justify-center gap-4">
              <Button variant="destructive" size="icon" className="w-16 h-16 rounded-full">
                <Icon name="PhoneOff" size={24} />
              </Button>
              <Button size="icon" className="w-16 h-16 rounded-full">
                <Icon name="Mic" size={24} />
              </Button>
              {callType === 'video' && (
                <Button size="icon" className="w-16 h-16 rounded-full">
                  <Icon name="VideoOff" size={24} />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewGroup} onOpenChange={setShowNewGroup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новая группа</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Название группы" />
            <Input placeholder="Описание (необязательно)" />
            <p className="text-sm text-gray-500">Выберите участников:</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {contacts.map(contact => (
                <label key={contact.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <div className="text-2xl">{contact.avatar}</div>
                  <span>{contact.name}</span>
                </label>
              ))}
            </div>
            <Button className="w-full">Создать группу</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewChannel} onOpenChange={setShowNewChannel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новый канал</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Название канала" />
            <Input placeholder="Описание канала" />
            <Button className="w-full">Создать канал</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {paymentType === 'sbp' && 'Оплата через СБП'}
              {paymentType === 'card' && 'Оплата картой'}
              {paymentType === 'premium' && 'Premium подписка'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {paymentType === 'premium' && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl text-center">
                <Icon name="Crown" size={48} className="mx-auto mb-3 text-yellow-600" />
                <h3 className="text-2xl font-bold mb-2">Premium подписка</h3>
                <p className="text-3xl font-bold text-gray-900">350₽<span className="text-base font-normal text-gray-500">/месяц</span></p>
                <ul className="mt-4 space-y-2 text-sm text-left">
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-green-600" />
                    Без рекламы
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-green-600" />
                    Эксклюзивные стикеры
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-green-600" />
                    Увеличенный лимит файлов
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-green-600" />
                    Приоритетная поддержка
                  </li>
                </ul>
              </div>
            )}
            {paymentType === 'sbp' && (
              <div className="text-center py-6">
                <div className="w-48 h-48 bg-gray-100 mx-auto rounded-xl flex items-center justify-center mb-4">
                  <Icon name="QrCode" size={96} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Отсканируйте QR-код в приложении банка</p>
              </div>
            )}
            {paymentType === 'card' && (
              <div className="space-y-3">
                <Input placeholder="Номер карты" />
                <div className="flex gap-3">
                  <Input placeholder="ММ/ГГ" className="flex-1" />
                  <Input placeholder="CVV" className="flex-1" />
                </div>
                <Input placeholder="Сумма" />
              </div>
            )}
            <Button onClick={processPayment} className="w-full h-12">
              {paymentType === 'premium' ? 'Оформить подписку' : 'Оплатить'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
