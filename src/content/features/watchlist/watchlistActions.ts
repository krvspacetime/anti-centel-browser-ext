/**
 * Feature for handling watchlist actions
 */

import { TargetHandle } from '../../types/targets';
import { loadTargetHandles, saveTargetHandles } from '../../services/storageService';
import { refreshTweetStyles } from '../tweets/highlightTweets';
import { createCategoryModal } from '../../components/modals';

/**
 * Handle adding or updating a handle in the watchlist
 * @param handle The handle to add or update
 */
export async function handleWatchlistAction(handle: string): Promise<void> {
  console.log(`Handling watchlist action for ${handle}`);
  
  // Show modal to select category and action
  const result = await createCategoryModal(handle);
  
  if (!result) {
    console.log("User cancelled the action");
    return;
  }
  
  const { tag, action } = result;
  
  // Get current target handles
  const targetHandles = await loadTargetHandles();
  
  // Check if handle already exists
  const existingIndex = targetHandles.findIndex(
    (target) => target.handle.toLowerCase() === handle.toLowerCase()
  );
  
  if (existingIndex >= 0) {
    // Update existing handle
    targetHandles[existingIndex] = {
      ...targetHandles[existingIndex],
      tag,
      action,
    };
    console.log(`Updated existing handle: ${handle}`);
  } else {
    // Add new handle
    targetHandles.push({
      handle,
      tag,
      action,
    });
    console.log(`Added new handle: ${handle}`);
  }
  
  // Save updated target handles
  await saveTargetHandles(targetHandles);
  
  // Refresh tweet styles
  refreshTweetStyles(handle);
}

/**
 * Remove a handle from the watchlist
 * @param handle The handle to remove
 */
export async function removeFromWatchlist(handle: string): Promise<void> {
  console.log(`Removing ${handle} from watchlist`);
  
  // Get current target handles
  const targetHandles = await loadTargetHandles();
  
  // Filter out the handle
  const updatedTargetHandles = targetHandles.filter(
    (target) => target.handle.toLowerCase() !== handle.toLowerCase()
  );
  
  // Save updated target handles
  await saveTargetHandles(updatedTargetHandles);
  
  // Refresh tweet styles
  refreshTweetStyles(handle);
}

/**
 * Check if a handle is in the watchlist
 * @param handle The handle to check
 * @returns Promise that resolves to true if the handle is in the watchlist
 */
export async function isInWatchlist(handle: string): Promise<boolean> {
  const targetHandles = await loadTargetHandles();
  return targetHandles.some(
    (target) => target.handle.toLowerCase() === handle.toLowerCase()
  );
}

/**
 * Get the target handle information for a specific handle
 * @param handle The handle to get information for
 * @returns The target handle information or null if not found
 */
export async function getTargetHandleInfo(handle: string): Promise<TargetHandle | null> {
  const targetHandles = await loadTargetHandles();
  return targetHandles.find(
    (target) => target.handle.toLowerCase() === handle.toLowerCase()
  ) || null;
}
