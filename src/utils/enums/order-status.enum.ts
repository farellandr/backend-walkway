export enum OrderStatus {
  CONFIRMED = 'confirmed',
  ALLOCATED = 'allocated',
  PICKING_UP = 'pickingUp',
  PICKED = 'picked',
  DROPPING_OFF = 'droppingOff',
  RETURN_IN_TRANSIT = 'returnInTransit',
  ON_HOLD = 'onHold',
  DELIVERED = 'delivered',
  REJECTED = 'rejected',
  COURIER_NOT_FOUND = 'courierNotFound',
  RETURNED = 'returned',
  CANCELLED = 'cancelled',
  DISPOSED = 'disposed'
}