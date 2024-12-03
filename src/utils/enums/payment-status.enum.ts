export enum PaymentStatus {
  AUTHORIZE = 'authorize',
  CAPTURE = 'capture',
  SETTLEMENT = 'settlement',
  DENY = 'deny',
  PENDING = 'pending',
  CANCEL = 'cancel',
  REFUND = 'refund',
  PARTIAL_REFUND = 'partial_refund',
  CHARGEBACK = 'chargeback',
  PARTIAL_CHARGEBACK = 'partial_chargeback',
  EXPIRE = 'expire', 
  FAILURE = 'failure'
}