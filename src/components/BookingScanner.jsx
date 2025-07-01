import React, { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  getDoc,
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export default function BookingScanner() {
  const videoRef = useRef(null);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("Scan a booking QR code...");
  const controlsRef = useRef(null);
  const [scanning, setScanning] = useState(true);

  // ✅ Define logScan once
  const logScan = useCallback(async (bookingId, data) => {
    await addDoc(collection(db, "scanLogs"), {
      bookingId,
      user: data.userName || "Unknown",
      event: data.event || "N/A",
      scannedAt: serverTimestamp(),
    });
  }, []);

  // ✅ Wrap verifyBooking in useCallback
  const verifyBooking = useCallback(async (bookingId) => {
    const docRef = doc(db, "bookings", bookingId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      setStatus("❌ Booking not found.");
      return;
    }

    const data = docSnap.data();
    if (data.verified) {
      setStatus("⚠️ Booking already verified!");
    } else {
      await updateDoc(docRef, { verified: true });
      setStatus("✅ Booking Verified!");
      await logScan(bookingId, data);
    }

    setResult(data);
  }, [logScan]);

  const startScanner = useCallback(() => {
    const codeReader = new BrowserMultiFormatReader();
    setStatus("📷 Scanning...");

    codeReader
      .decodeFromVideoDevice(
        null,
        videoRef.current,
        async (result, err, controls) => {
          if (result) {
            const bookingId = result.getText();
            setStatus(`Checking booking ID: ${bookingId}...`);
            controls.stop();
            controlsRef.current = null;
            setScanning(false);
            await verifyBooking(bookingId);
          }
        }
      )
      .then((controls) => {
        controlsRef.current = controls;
      })
      .catch((err) => {
        console.error("Camera error:", err);
        setStatus("❌ Error accessing camera.");
      });
  }, [verifyBooking]);

  useEffect(() => {
    if (scanning) {
      startScanner();
    }

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, [scanning, startScanner]);

  const handleScanAnother = () => {
    setResult(null);
    setScanning(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Event Booking Scanner</h2>
      {scanning ? (
        <video
          ref={videoRef}
          className="w-full max-w-md border rounded shadow"
        />
      ) : (
        <button
          onClick={handleScanAnother}
          className="mt-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600"
        >
          Scan Another
        </button>
      )}
      <p className="mt-4 text-lg">{status}</p>
      {result && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <h3 className="font-semibold">Booking Details:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
