export interface DeliveryZone {
  id: string;
  merchantId: string;
  neighborhood: string;
  deliveryFee: number;
  minimumOrder?: number;
  estimatedTime?: string;
  isActive: boolean;
}
