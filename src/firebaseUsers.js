import { doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";  // Adjust the path based on your structure

// ✅ Create user document if it doesn't exist
export async function createUserDocIfNotExists(user) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  try {
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        viewedCategories: [],
        likedEvents: [],
        email: user.email || "",
        createdAt: serverTimestamp(),
      });
      console.log("✅ User document created");
    }
  } catch (error) {
    console.error("❌ Error creating user document:", error);
  }
}

// ✅ Add a category to user's viewedCategories array
export async function saveViewedCategory(userId, category) {
  if (!userId || !category) return;

  const userRef = doc(db, "users", userId);

  try {
    await updateDoc(userRef, {
      viewedCategories: arrayUnion(category),
    });
    console.log(`✅ Category '${category}' saved to user profile`);
  } catch (error) {
    console.error("❌ Error saving category:", error);
  }
}

// 🔁 (Optional) Save liked event (if you plan to add a like button later)
export async function saveLikedEvent(userId, eventId) {
  if (!userId || !eventId) return;

  const userRef = doc(db, "users", userId);

  try {
    await updateDoc(userRef, {
      likedEvents: arrayUnion(eventId),
    });
    console.log(`❤️ Event '${eventId}' liked`);
  } catch (error) {
    console.error("❌ Error saving liked event:", error);
  }
}
