import type { InventoryItem } from '@/types';

// Base API URL - Use absolute URL for server-side calls
const API_BASE = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/inventory`
  : '/api/inventory'; // Fallback for client-side

// Ambil semua data inventory
export async function getAllInventoryItems(): Promise<InventoryItem[]> {
  try {
    const response = await fetch(API_BASE, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch inventory items');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
}

// Simpan atau update satu item inventory
export async function saveInventoryItem(item: InventoryItem): Promise<void> {
  try {
    const itemToSave = { ...item, updatedAt: new Date() }; // Set updatedAt
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemToSave),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save inventory item');
    }
    
    await response.json();
  } catch (error) {
    console.error('Error saving inventory item:', error);
    throw error;
  }
}

// Simpan atau update banyak item inventory
export async function saveInventoryItemsBatch(items: InventoryItem[]): Promise<void> {
  try {
    if (items.length === 0) return;
    const itemsToSave = items.map(item => ({ ...item, updatedAt: new Date() })); // Set updatedAt for batch
    const response = await fetch(`${API_BASE}/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemsToSave),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save inventory items batch');
    }
    
    await response.json();
  } catch (error) {
    console.error('Error saving inventory items batch:', error);
    throw error;
  }
}

// Hapus data inventory berdasarkan array noData
export async function deleteInventoryItems(noDataIds: string[]): Promise<void> {
  try {
    if (noDataIds.length === 0) return;
    
    const response = await fetch(API_BASE, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ noDataIds }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete inventory items');
    }
    
    await response.json();
  } catch (error) {
    console.error('Error deleting inventory items:', error);
    throw error;
  }
}

// Update satu item inventory
export async function updateInventoryItem(item: InventoryItem): Promise<void> {
  try {
    const itemToUpdate = { ...item, updatedAt: new Date() }; // Set updatedAt
    const response = await fetch(API_BASE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemToUpdate),
    });

    if (!response.ok) {
      throw new Error('Failed to update inventory item');
    }

    await response.json();
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
}

export function listenToInventoryData(callback: (data: InventoryItem[]) => void): () => void {
  let isSubscribed = true;
  
  const fetchData = async () => {
    try {
      const data = await getAllInventoryItems();
      if (isSubscribed) {
        callback(data);
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };

  // Fetch immediately
  fetchData();

  // Set up polling every 5 seconds
  const intervalId = setInterval(fetchData, 5000);

  // Return unsubscribe function
  return () => {
    isSubscribed = false;
    clearInterval(intervalId);
  };
}