import asyncio, websockets, json, sys

TOPIC = sys.argv[1] if len(sys.argv) > 1 else "rbi-rates-2026"

async def test():
    async with websockets.connect("ws://localhost:8000/ws/briefing") as ws:
        await ws.send(json.dumps({"topic": TOPIC}))
        while True:
            msg = await ws.recv()
            data = json.loads(msg)
            event = data["event"]
            if event == "card_ready":
                print(f"Event: {event} | Card {data['payload']['card_index']} | {data['payload']['card_type']}")
            elif event == "disagreements_ready":
                takes = data["payload"]["critical_takes"]
                print(f"Event: {event} | {len(takes)} critical takes")
            else:
                print(f"Event: {event}")

asyncio.run(test())
