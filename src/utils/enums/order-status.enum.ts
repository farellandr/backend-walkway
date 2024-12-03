export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ALLOCATED = 'allocated',
  PICKING_UP = 'picking_up',
  PICKED = 'picked',
  DROPPING_OFF = 'dropping_off',
  RETURN_IN_TRANSIT = 'return_in_transit',
  ON_HOLD = 'on_hold',
  DELIVERED = 'delivered',
  REJECTED = 'rejected',
  COURIER_NOT_FOUND = 'courier_not_found',
  RETURNED = 'returned',
  CANCELLED = 'cancelled',
  DISPOSED = 'disposed'
}