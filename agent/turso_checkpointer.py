"""
Turso Embedded Replica Checkpointer for LangGraph
Implements local SQLite + cloud auto-sync using Turso's embedded replica feature
"""

import os
from pathlib import Path
from typing import Optional
import aiosqlite
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver


class TursoSyncedCheckpointer:
    """
    LangGraph checkpointer using Turso embedded replica

    How it works:
    1. libsql maintains a local SQLite file
    2. Automatically syncs to Turso cloud in the background (if configured)
    3. LangGraph reads/writes to local file (using aiosqlite + AsyncSqliteSaver)
    4. Turso provides distributed access and backups

    Advantages:
    - No need to modify LangGraph code
    - Low latency for local operations
    - Works offline
    - Automatic cloud sync and backup
    """

    def __init__(
        self,
        local_db_path: str = "data/checkpoints.db",
        sync_url: Optional[str] = None,
        auth_token: Optional[str] = None,
        sync_interval: int = 60,
    ):
        """
        Initialize Turso synced checkpointer

        Args:
            local_db_path: Local SQLite database file path
            sync_url: Turso database URL (e.g., libsql://your-db.turso.io)
            auth_token: Turso access token
            sync_interval: Sync interval in seconds, default 60 seconds
        """
        self.local_db_path = local_db_path
        self.sync_url = sync_url
        self.auth_token = auth_token
        self.sync_interval = sync_interval
        self.turso_client = None
        self.aiosqlite_conn = None  # Store connection reference for cleanup

        # Ensure database directory exists
        Path(local_db_path).parent.mkdir(parents=True, exist_ok=True)

        # If Turso config is provided, initialize cloud sync
        if sync_url and auth_token:
            self._init_turso_sync()

    def _init_turso_sync(self):
        """Initialize Turso embedded replica sync"""
        try:
            import libsql

            print("✓ Initializing Turso embedded replica")
            print(f"  Local DB: {self.local_db_path}")
            print(f"  Sync URL: {self.sync_url}")
            print(f"  Sync interval: {self.sync_interval}s")

            # Create embedded replica client
            # This maintains a local SQLite file and automatically syncs to Turso
            self.turso_client = libsql.connect(
                database=self.local_db_path,
                sync_url=self.sync_url,
                auth_token=self.auth_token,
                sync_interval=self.sync_interval,
            )

            print("✓ Turso sync enabled (embedded replica mode)")

        except ImportError:
            print(
                "⚠ Warning: libsql not installed. Cloud sync disabled. "
                "Install with: pip install libsql"
            )
            self.turso_client = None
        except Exception as e:
            print(f"⚠ Warning: Failed to initialize Turso sync: {e}")
            print("  Continuing with local-only mode")
            self.turso_client = None

    async def get_checkpointer(self) -> AsyncSqliteSaver:
        """
        Get configured LangGraph checkpointer

        Returns:
            AsyncSqliteSaver: LangGraph-compatible async SQLite checkpointer
        """
        # Use standard aiosqlite to connect to local file
        # libsql automatically syncs in the background (if enabled)
        self.aiosqlite_conn = await aiosqlite.connect(self.local_db_path)

        # Create LangGraph's AsyncSqliteSaver
        checkpointer = AsyncSqliteSaver(self.aiosqlite_conn)

        # Initialize table schema
        await checkpointer.setup()

        return checkpointer

    def sync_now(self):
        """
        Manually trigger immediate sync to Turso cloud

        Call this at critical moments (e.g., user logout, before app shutdown)
        to ensure data has been synced
        """
        if self.turso_client:
            try:
                print("⏳ Manually syncing to Turso...")
                self.turso_client.sync()
                print("✓ Sync completed")
            except Exception as e:
                print(f"⚠ Warning: Manual sync failed: {e}")
        else:
            print("ℹ No cloud sync configured (local-only mode)")

    async def close(self):
        """
        Explicitly close all resources (aiosqlite + libsql)

        Should be called on app shutdown to ensure:
        1. Final sync to cloud
        2. Database connections closed
        3. Background sync threads stopped
        """
        print("🔄 Closing checkpointer resources...")

        # 1. Final sync to Turso
        if self.turso_client:
            try:
                print("  ⏳ Final sync to Turso...")
                self.turso_client.sync()
                print("  ✓ Final sync completed")
            except Exception as e:
                print(f"  ⚠ Warning: Final sync failed: {e}")

        # 2. Close aiosqlite connection
        if self.aiosqlite_conn:
            try:
                print("  🔌 Closing aiosqlite connection...")
                await self.aiosqlite_conn.close()
                print("  ✓ aiosqlite connection closed")
            except Exception as e:
                print(f"  ⚠ Warning: Failed to close aiosqlite: {e}")

        # 3. Close libsql client (stops background threads)
        if self.turso_client:
            try:
                print("  🔌 Closing Turso client...")
                self.turso_client.close()
                print("  ✓ Turso client closed")
            except Exception as e:
                print(f"  ⚠ Warning: Failed to close Turso client: {e}")

        print("✓ Checkpointer resources cleaned up")


def get_turso_checkpointer_from_env() -> TursoSyncedCheckpointer:
    """
    Create Turso checkpointer from environment variables

    Environment variables:
        TURSO_DATABASE_URL: Turso database URL (optional)
        TURSO_AUTH_TOKEN: Turso access token (optional)
        TURSO_SYNC_INTERVAL: Sync interval in seconds (optional, default 60)

    Returns:
        TursoSyncedCheckpointer: Configured checkpointer instance
    """
    sync_url = os.getenv("TURSO_DATABASE_URL")
    auth_token = os.getenv("TURSO_AUTH_TOKEN")
    sync_interval = int(os.getenv("TURSO_SYNC_INTERVAL", "60"))

    # Local database path
    db_path = Path(__file__).parent / "data" / "checkpoints.db"

    return TursoSyncedCheckpointer(
        local_db_path=str(db_path),
        sync_url=sync_url,
        auth_token=auth_token,
        sync_interval=sync_interval,
    )
