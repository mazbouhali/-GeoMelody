//real time listener

//db.collection('songs').onSnapshot((snapshot) => {
   // console.log(snapshot.docChanges());
//})

const unsub = onSnapshot(collection(db, "songs"), (collection) => {
   console.log("Current data: ", collection.data());
});
