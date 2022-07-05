const encoder = new TextEncoder();

export interface SSEEvent {
  event: string;
  data?: unknown;
}

export class SSE<T extends SSEEvent> {
  controllers: Map<number, ReadableStreamController<Uint8Array>> = new Map();
  controllerId = 0;

  accept(): Response {
    const id = this.controllerId;
    this.controllerId++;

    const stream = new ReadableStream({
      start: (controller) => {
        this.controllers.set(id, controller);
      },
      cancel: () => {
        this.controllers.delete(id);
      },
    });

    const response = new Response(stream, {
      headers: { "Content-Type": "text/event-stream; charset=utf-8" },
    });
    return response;
  }

  send({ event, data = null }: T): void {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    const encodedMessage = encoder.encode(message);

    for (const controller of this.controllers.values()) {
      controller.enqueue(encodedMessage);
    }
  }
}
