import React, { useState, useEffect } from 'react';
import { Newspaper, Plus, Edit2, Trash2, Calendar, User, AlertCircle } from 'lucide-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'info' | 'update' | 'urgent' | 'maintenance';
  targetAudience: string[];
  author: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export const NewsPage: React.FC = () => {
  const { user } = useCurrentUser();
  const currentUser = user;
  const [news, setNews] = useState<NewsItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'info' as 'info' | 'update' | 'urgent' | 'maintenance',
    targetAudience: [] as string[],
    expiresAt: ''
  });

  const categories = {
    info: { label: 'Informativo', color: 'bg-blue-500', icon: '📢' },
    update: { label: 'Atualização', color: 'bg-green-500', icon: '🔄' },
    urgent: { label: 'Urgente', color: 'bg-red-500', icon: '⚠️' },
    maintenance: { label: 'Manutenção', color: 'bg-yellow-500', icon: '🔧' }
  };

  const audiences = [
    'Todos',
    'Administradores',
    'Time Samsung',
    'Call Center',
    'Representantes'
  ];

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = () => {
    const savedNews = JSON.parse(localStorage.getItem('miniescopo_news') || '[]');
    setNews(savedNews);
  };

  const saveNews = (newsItem: NewsItem) => {
    const savedNews = JSON.parse(localStorage.getItem('miniescopo_news') || '[]');
    const updatedNews = editingNews 
      ? savedNews.map((n: NewsItem) => n.id === newsItem.id ? newsItem : n)
      : [...savedNews, newsItem];
    
    localStorage.setItem('miniescope_news', JSON.stringify(updatedNews));
    setNews(updatedNews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Título e conteúdo são obrigatórios!');
      return;
    }

    const newsItem: NewsItem = {
      id: editingNews?.id || Date.now().toString(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      targetAudience: formData.targetAudience.length > 0 ? formData.targetAudience : ['Todos'],
      author: currentUser?.name || 'Admin',
      createdAt: editingNews?.createdAt || new Date().toISOString(),
      expiresAt: formData.expiresAt || undefined,
      isActive: true
    };

    saveNews(newsItem);
    resetForm();
    alert(`Notícia ${editingNews ? 'atualizada' : 'criada'} com sucesso!`);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'info',
      targetAudience: [],
      expiresAt: ''
    });
    setEditingNews(null);
    setShowForm(false);
  };

  const editNews = (newsItem: NewsItem) => {
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      category: newsItem.category,
      targetAudience: newsItem.targetAudience,
      expiresAt: newsItem.expiresAt || ''
    });
    setEditingNews(newsItem);
    setShowForm(true);
  };

  const deleteNews = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta notícia?')) {
      const updatedNews = news.filter(n => n.id !== id);
      localStorage.setItem('miniescope_news', JSON.stringify(updatedNews));
      setNews(updatedNews);
    }
  };

  const toggleNewsStatus = (id: string) => {
    const updatedNews = news.map(n => 
      n.id === id ? { ...n, isActive: !n.isActive } : n
    );
    localStorage.setItem('miniescope_news', JSON.stringify(updatedNews));
    setNews(updatedNews);
  };

  const handleAudienceChange = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter(a => a !== audience)
        : [...prev.targetAudience, audience]
    }));
  };

  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Acesso Negado</h2>
          <p className="text-red-600">Apenas administradores podem gerenciar notícias.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Newspaper className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Gerenciar Notícias</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nova Notícia</span>
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="p-6 border-b border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Digite o título da notícia"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {Object.entries(categories).map(([key, cat]) => (
                      <option key={key} value={key}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Expiração
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Público Alvo
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {audiences.map(audience => (
                      <label key={audience} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.targetAudience.includes(audience)}
                          onChange={() => handleAudienceChange(audience)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{audience}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conteúdo *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Digite o conteúdo da notícia..."
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingNews ? 'Atualizar' : 'Criar'} Notícia
                </button>
              </div>
            </form>
          </div>
        )}

        {/* News List */}
        <div className="p-6">
          {news.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notícia</h3>
              <p className="text-gray-500">Clique em "Nova Notícia" para começar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((newsItem) => {
                const category = categories[newsItem.category];
                const isExpired = newsItem.expiresAt && new Date(newsItem.expiresAt) < new Date();
                
                return (
                  <div
                    key={newsItem.id}
                    className={`border rounded-lg p-6 ${
                      !newsItem.isActive || isExpired ? 'opacity-60 bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`${category.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                            {category.icon} {category.label}
                          </span>
                          {!newsItem.isActive && (
                            <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm">
                              Inativo
                            </span>
                          )}
                          {isExpired && (
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                              Expirado
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {newsItem.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {newsItem.content}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{newsItem.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(newsItem.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div>
                            Público: {newsItem.targetAudience.join(', ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => toggleNewsStatus(newsItem.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            newsItem.isActive
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={newsItem.isActive ? 'Desativar' : 'Ativar'}
                        >
                          {newsItem.isActive ? '👁️' : '👁️‍🗨️'}
                        </button>
                        <button
                          onClick={() => editNews(newsItem)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteNews(newsItem.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};