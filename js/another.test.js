// Mock Firestore
jest.mock("firebase/firestore", () => {
  const firestore = {
    collection: jest.fn(() => firestore),
    doc: jest.fn(() => firestore),
    set: jest.fn(),
    get: jest.fn(),
    add: jest.fn(),
    addDoc: jest.fn(() => Promise.resolve({ id: 'new-doc-id' })),
    update: jest.fn(),
    deleteDoc: jest.fn(() => Promise.resolve()),
    delete: jest.fn(),
    orderBy: jest.fn(() => firestore),
    where: jest.fn(() => firestore),
    limit: jest.fn(() => firestore),
    onSnapshot: jest.fn((callback) => {
      return function(snapshot) {
        console.log(snapshot);
        callback(snapshot);
      }
    }),
    getFirestore: jest.fn(() => firestore),
  };
  return { ...firestore };
});

// Import the necessary Firebase functions
const { getFirestore } = require("firebase/firestore");
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

// Import the Firebase configuration object
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Import jsdom and set up a mock document object
const { JSDOM } = require("jsdom");
const { document } = new JSDOM("").window;
global.document = document;

const fail = (error) => {
  console.error(error);
  throw error;
};

// Define the tests
describe("Firebase", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test("getAuth() returns a valid auth object", () => {
    expect(getAuth()).toBeDefined();
  });

  test("getFirestore() returns a valid firestore object", () => {
    expect(getFirestore()).toBeDefined();
  });

  test("getDocs() returns a reference to the songs collection", () => {
    const db = getFirestore();
    const q = db.collection("songs").orderBy("createdAt");
    expect(q).toBeDefined();
  });

  test("onSnapshot() logs real-time data in the songs collection", ()=> {
    jest.useFakeTimers();
    const db = getFirestore();
    const q = db.collection("songs").orderBy("createdAt");
    const mockCallback = jest.fn((snapshot) => {
      console.log(snapshot);
    });
    
    const unsubscribe = q.onSnapshot(mockCallback);
    // Add a new song to the collection
    db.collection("songs").addDoc({
      title: "Test song",
      artist: "Test artist",
      createdAt: new Date(),
    }).then(() => {
      // Wait for the snapshot listener to be called
      setTimeout(() => {
        expect(mockCallback).toHaveBeenCalled();
        expect(mockCallback.mock.calls[0][0].data()).toEqual({
          title: "Test song",
          artist: "Test artist",
          createdAt: expect.any(Date)
        });
        unsubscribe();
      }, 1000);
    });
  });
});
