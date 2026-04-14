import prismaClient from "../../prisma";

interface CreateOrderServiceProps {
  table: number;
  name: string;
}

class CreateOrderService {
  async execute({ table, name }: CreateOrderServiceProps) {
    try {
      const order = await prismaClient.orders.create({
        data: {
          table: table,
          name: name ?? "",
        },
        select: {
          id: true,
          table: true,
          name: true,
          status: true,
          draft: true,
          createAd: true,
        },
      });

      return order;
    } catch (err) {
      throw new Error("Falha ao criar pedido");
    }
  }
}

export { CreateOrderService };
