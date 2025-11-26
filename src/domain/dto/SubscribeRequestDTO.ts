export interface SubscribeRequestDTO {
  subscriptionType: "chapter";
  targetId: number;
  workId: number;
  provider: "mercadopago";
}