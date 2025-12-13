import Spinner from '../../components/common/Spinner';
import progressService from '../../services/progress.service.js';
import toast from 'react-hot-toast';
import { FileText, Dock, TrendingUp, BrainCircuit, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const fetchedData = await progressService.getDashboard();
        setDashboardData(fetchedData.data);
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-accent to-light flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ">
            <TrendingUp className="w-8 h-8 " />
          </div>
          <p className="text-md">No dashboard data available</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Documents',
      value: dashboardData.overview.documentCount,
      icon: FileText,
      gradient: 'from-red-400 to-red-700',
    },
    {
      label: 'Total Flashcards',
      value: dashboardData.overview.flashcardsetCount,
      icon: Dock,
      gradient: 'from-green-600 to-green-900',
    },
    {
      label: 'Total Quizzes',
      value: dashboardData.overview.quizzesCount,
      icon: BrainCircuit,
      gradient: 'from-pink-500 to-amber-800',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-medium mb-2">Dashboard</h1>
          <p className="text-md">Track your learning progress</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative border hover:shadow-primary rounded-2xl shadow-md shadow-primary p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide">{stat.label}</span>
              <div
                className={`w-11 h-11 rounded-xl bg-linear-to-br ${stat.gradient} shadow-lg ${stat.shadowColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon strokeWidth={2} className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-semibold tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center">
            <Clock strokeWidth={2} className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-medium tracking-tight">Recent Activity</h3>
        </div>

        {dashboardData.recentActivity &&
        (dashboardData.recentActivity.documents.length > 0 ||
          dashboardData.recentActivity.quizzes.length > 0) ? (
          <div>
            {[
              ...(dashboardData.recentActivity.documents || []).map((doc) => ({
                id: doc._id,
                description: doc.title,
                timestamp: doc.lastAccessed || doc.createdAt,
                link: `/documents/${doc._id}`,
                type: 'document',
              })),
              ...(dashboardData.recentActivity.quizzes || []).map((quiz) => ({
                id: quiz._id,
                description: quiz.title,
                timestamp: quiz.completedAt || quiz.createdAt,
                isComplete: quiz.completedAt ? true : false,
                link: `/quizzes/${quiz._id}`,
                type: 'quiz',
              })),
            ]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((activity, index) => (
                <div
                  key={activity.id || index}
                  className="group flex items-center justify-between p-4 rounded-xl border hover:shadow-secondary hover:shadow-md transition-all duration-200 mb-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-2 h-2 rounded-full ${activity.type === 'document' ? 'bg-red-600' : 'bg-pink-500'}`}
                      />
                      <p className="text-sm font-medium truncate">
                        Accessed {activity.type === 'document' ? 'Document' : 'Quiz'}
                        <span>{activity.description}</span>
                      </p>
                    </div>
                    <p className="text-xs pl-4">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  {activity.link && (
                    <a
                      href={activity.link}
                      className="ml-4 px-4 py-2 text-xs font-semibold bg-accent hover:bg-accent/80 rounded-lg transition-all duration-300"
                    >
                      View
                    </a>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4">
              <Clock className="h-8 w-8 " />
            </div>
            <p className="text-sm">No recent activity yet.</p>
            <p className="text-xs">Start learning to see your progress here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
