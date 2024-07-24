import os
import sys
import asyncio
import websockets
import django

# Append your project path to the sys.path
sys.path.append("/code/")

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'task_scheduler_app.settings')

# Setup Django
django.setup()

from task_scheduler_app.tools.helpers import logger


class User:
    def __init__(self, email, websocket):
        self.email = email
        self.websocket = websocket

class WebSocketServer:
    """
    A WebSocket server class that allows sending messages to specific users.
    """

    def __init__(self, host="localhost", port=8765):
        task_scheduler_url = os.getenv("TASK_SCHEDULER_URL", "localhost")
        # task_scheduler_url =  "http://172.26.0.7:5000"
        self.host = task_scheduler_url.split("://")[1].split(":")[0]
        self.port = port
        self.users = {}  # Dictionary to store users and their connections

    async def handle_connection(self, websocket, path):
        """
        Handles incoming connections and messages from clients.
        """
        try:
            email = self._get_email_from_path(path)
            source = self._get_source_from_path(path)
            
            if email:
                self.users[email] = User(email, websocket)
            elif source:
                logger.info(f"Received connection from third party with source email {source}")
            else:
                await websocket.send("Invalid connection: Email required.")
                await websocket.wait_closed()
                return
        except Exception as e:
            logger.error(f"Error handling connection: {e}")
            await websocket.send(f"Error handling connection: {e}")
            await websocket.wait_closed()
            return

        try:
            async for message in websocket:
                logger.info(f"Received message from {email if email else source}: {message}")
                # You can handle incoming messages here if needed
                if source:
                    # Send Incoming message from other backends scripts to all connected js clients
                    await self.send_message(email=source, message=message)
        finally:
            self.users.pop(email, None)  # Remove user on disconnect

    def _get_email_from_path(self, path):
        """
        Extracts the email parameter from the WebSocket connection path.
        """
        try:
            query_params = path.split("?")[1]
            email = query_params.split("email=")[1].split("&")[0]
            return email
        except IndexError:
            return None
        
    def _get_source_from_path(self, path):
        """
        Extracts the source parameter from the WebSocket connection path.
        """
        try:
            query_params = path.split("?")[1]
            source = query_params.split("source=")[1].split("&")[0]
            return source
        except IndexError:
            return None

    async def send_message(self, email, message):
        """
        Sends a message to a specific user identified by email.
        """
        if email in self.users:
            try:
                logger.info(f"User with email '{email}' found.")
                await self.users[email].websocket.send(message)
                logger.info(f"Message sent successfully.")
            except websockets.ConnectionClosed as e:
                # Handle connection closed gracefully (remove user)
                logger.warning(f"Connection closed for user with email '{email}': {e}")
                self.users.pop(email, None)

    async def start(self):
        """
        Starts the WebSocket server.
        """
        async with websockets.serve(self.handle_connection, self.host, self.port):
            logger.info(f"Server listening on ws://{self.host}:{self.port}")
            await asyncio.Future()  # Run the server indefinitely

if __name__ == "__main__":
    logger.info("Starting WebSocket server...")
    server = WebSocketServer()
    asyncio.run(server.start())
