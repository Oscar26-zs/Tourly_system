import { Calendar, Users, MapPin, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../../app/providers/useAuth';
import { useUserBookings, useCancelBooking } from '../hooks/useUserBookings';
import type { BookingStatus, UserBooking } from '../types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { useTranslation } from 'react-i18next';

const UserBookingsSection = () => {
  const { user } = useAuth();
  const { data: bookings, isLoading, error, isError } = useUserBookings(user?.uid || '');
  const navigate = useNavigate();
  const toast = useToast();
  const { t, i18n } = useTranslation();

  // Estados de carga
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-700 rounded-md w-1/3 mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-neutral-800 rounded-lg p-6 mb-4">
              <div className="h-6 bg-neutral-700 rounded w-3/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-4 bg-neutral-700 rounded w-full"></div>
                <div className="h-4 bg-neutral-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Estados de error
  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-400 mb-2">{t('bookings.header')}</h3>
          <p className="text-neutral-400 mb-4">{t('bookings.description')}</p>
          <p className="text-sm text-red-400">{error?.message}</p>
        </div>
      </div>
    );
  }

  // Función para obtener el estilo del estado
  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-900/30 text-green-400 border-green-700/50';
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50';
      case 'cancelled':
        return 'bg-red-900/30 text-red-400 border-red-700/50';
      case 'completed':
        return 'bg-blue-900/30 text-blue-400 border-blue-700/50';
      default:
        return 'bg-neutral-700/30 text-neutral-400 border-neutral-600/50';
    }
  };

  // Función para formatear el estado
  const formatStatus = (status: BookingStatus) => {
    return t(`bookings.status.${status}` as any) ?? status;
  };

  // Función para formatear fecha
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(i18n.language || undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Componente de tarjeta de reserva
  const BookingCard = ({ booking }: { booking: UserBooking }) => {
    const { user } = useAuth();
    const { cancelBooking } = useCancelBooking();
    
    const handleCancelBooking = async () => {
      const bookingId = booking.id || booking.idReserva;
      if (!bookingId || !user?.uid) return;

      try {
        await cancelBooking(bookingId, user.uid);

        toast.show({
          id: `cancel-${bookingId}`,
          title: t('bookingsToast.cancelledTitle'),
          description: t('bookingsToast.cancelledDesc', { id: bookingId }),
          duration: 5000
        });
      } catch (error) {
        toast.show({
          id: `error-${bookingId}`,
          title: t('bookingsToast.cancelErrorTitle'),
          description: t('bookingsToast.cancelErrorDesc'),
          duration: 5000
        });
        console.error('Error:', error);
      }
    };

    return (
      <div className="bg-gradient-to-r from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-green-700/20 rounded-lg p-6 mb-4 hover:border-green-600/30 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('bookings.card.booking', { id: booking.id || booking.idReserva || 'Unknown' })}
            </h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(booking.estado)}`}>
              {formatStatus(booking.estado)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-400">${booking.precioTotal}</p>
            <p className="text-sm text-neutral-400">{t('bookings.card.totalAmount')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-neutral-300">
            <Calendar className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="font-medium">{t('bookings.card.bookingDate')}</p>
              <p className="text-sm text-neutral-400">{formatDate(booking.fechaReserva)}</p>
            </div>
          </div>

          <div className="flex items-center text-neutral-300">
            <Users className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="font-medium">{t('bookings.card.guests')}</p>
              <p className="text-sm text-neutral-400">{booking.peopleCount ?? 0} {t('bookings.card.guestLabel', { count: booking.peopleCount ?? 0 })}</p>
            </div>
          </div>

          <div className="flex items-center text-neutral-300">
            <DollarSign className="h-5 w-5 text-yellow-500 mr-3" />
            <div>
              <p className="font-medium">{t('bookings.card.pricePerPerson')}</p>
              <p className="text-sm text-neutral-400">${booking.precioUnitario}</p>
            </div>
          </div>

          <div className="flex items-center text-neutral-300">
            <Clock className="h-5 w-5 text-purple-500 mr-3" />
            <div>
              <p className="font-medium">{t('bookings.card.created')}</p>
              <p className="text-sm text-neutral-400">{formatDate(booking.fechaCreacion)}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-700">
          <div className="flex justify-between items-center">
            <div className="text-sm text-neutral-400">
              <p>{t('bookings.card.tourId', { id: booking.idTour })}</p>
              <p>{t('bookings.card.slotId', { id: booking.idSlot })}</p>
            </div>
            <div className="flex gap-2">
              {booking.estado !== 'cancelled' && (
                <button
                  onClick={handleCancelBooking}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {t('bookings.buttons.cancelBooking')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">{t('bookings.header')}</h2>
        <p className="text-neutral-400">{t('bookings.description')}</p>
      </div>

      {bookings && bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-neutral-800/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-white">{bookings.length}</p>
            <p className="text-sm text-neutral-400">{t('bookings.stats.totalBookings')}</p>
          </div>
          <div className="bg-neutral-800/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">
              {bookings.filter(b => b.estado === 'confirmed').length}
            </p>
            <p className="text-sm text-neutral-400">{t('bookings.stats.confirmed')}</p>
          </div>
           <div className="bg-neutral-800/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-400">
              {bookings.filter(b => b.estado === 'cancelled').length}
            </p>
            <p className="text-sm text-neutral-400">{t('bookings.stats.cancelled')}</p>
          </div>
          <div className="bg-neutral-800/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">
              ${bookings.reduce((total, booking) => total + booking.total, 0)}
            </p>
            <p className="text-sm text-neutral-400">{t('bookings.stats.totalSpent')}</p>
          </div>
        </div>
      )}

      {bookings && bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id || booking.idReserva || Math.random()} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="bg-neutral-800/50 rounded-lg p-12 text-center">
          <MapPin className="h-16 w-16 text-neutral-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t('bookings.noBookingsTitle')}</h3>
          <p className="text-neutral-400 mb-6">{t('bookings.noBookingsText')}</p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            onClick={() => navigate('/')}
          >
            {t('bookings.buttons.browseTours')}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserBookingsSection;