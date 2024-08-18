/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Matt Briscoe, Noah Howard
 */

/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.fbAuthManager = null;
rhit.fbRiderRequestManager = null;

/** Rider References */
rhit.FB_COLLECTION_RIDER_ACCOUNTS = "rider_accounts";
rhit.FB_RIDER_KEY_FIRSTNAME = "firstName";
rhit.FB_RIDER_KEY_LASTNAME = "lastName";
rhit.FB_RIDER_KEY_PHONENUMBER = "phoneNumber";
rhit.FB_RIDER_KEY_ROSEEMAIL = "roseEmail";

/** Driver References */
rhit.FB_COLLECTION_DRIVER_ACCOUNTS = "driver_accounts";
rhit.FB_DRIVER_KEY_FIRSTNAME = "firstName";
rhit.FB_DRIVER_KEY_LASTNAME = "lastName";
rhit.FB_DRIVER_KEY_PHONENUMBER = "phoneNumber";
rhit.FB_DRIVER_KEY_ROSEEMAIL = "roseEmail";
rhit.FB_DRIVER_SUBCOLLECTION = "car";

/** Rides References */
rhit.FB_COLLECTION_RIDES = "rides";
rhit.FB_RIDES_KEY_DESTINATION = "destination";
rhit.FB_RIDES_KEY_DRIVER = "driver";
rhit.FB_RIDES_KEY_PICKUPLOCATION = "pickupLocation";
rhit.FB_RIDES_KEY_PICKUPTIME = "pickupTime";
rhit.FB_RIDES_KEY_PRICE = "price";
rhit.FB_RIDES_RIDER = "rider"

rhit.fbRiderManager = null;
rhit.fbDriverManager = null;
rhit.fbRideListManager = null;
rhit.fbRideDetailManager = null;

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.FbDriverManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_DRIVER_ACCOUNTS);
		this._unsubscribe = null;
		this._userFields = [];
	}
	add(username, firstName, lastName, phoneNumber, roseEmail, carDetails) {

		this._ref.doc(username).set({
			[rhit.FB_RIDER_KEY_FIRSTNAME]: firstName,
			[rhit.FB_RIDER_KEY_LASTNAME]: lastName,
			[rhit.FB_RIDER_KEY_PHONENUMBER]: phoneNumber,
			[rhit.FB_RIDER_KEY_ROSEEMAIL]: roseEmail
		})
			.then(() => {
				this.addCarToDriver(username, carDetails);
				console.log("Document written");
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
			});
	}

	docIdExists(docId) {
		return this._ref.doc(docId).get().then((docSnapshot) => {
			if (docSnapshot.exists) {
				console.log(`Document ${docId} exists:`, docSnapshot.data());
				return true;
			} else {
				console.log("No such document!");
				return false;
			}
		}).catch((error) => {
			console.log("Error checking document:", error);
			return false;  // Return false in case of error
		});
	}

	getDriverInfo() {

		const documentRef = this._ref.doc(rhit.fbAuthManager.uid);
		documentRef.get().then((docSnapshot) => {
			if (docSnapshot.exists) {
				// Document data will be in docSnapshot.data()
				this._userFields = docSnapshot.data();
				const data = docSnapshot.data();
				console.log("Document data:", data);
				return this._userFields;
			} else {
				console.log("No such document!");
			}
		}).catch((error) => {
			console.error("Error getting document:", error);
		});
	}


	beginListening(changeListener) {

		this._unsubscribe = this._ref
			.onSnapshot((querySnapshot) => {
				this._documentSnapshots = querySnapshot.docs;
				// querySnapshot.forEach((doc) => {
				//     console.log(doc.data);
				// });
				changeListener();
			});

	}
	stopListening() {
		this._unsubscribe();
	}

	async addCarToDriver(username, carDetails) {
		try {
			const driverRef = this._ref.doc(username);

			await driverRef.collection('cars').doc(carDetails.licensePlate).set({
                make: carDetails.make,
                model: carDetails.model,
                year: carDetails.year,
                color: carDetails.color,
                licensePlate: carDetails.licensePlate
            });

			console.log('Car added successfully!');
			window.location.href = "/driverDashboard.html";
		} catch (error) {
			console.error("Error adding car: ", error);
		}
	}

	get length() {
		return this._documentSnapshots.length
	}
}

isADriver = async function (docId) {
	let exists = await rhit.fbDriverManager.docIdExists(rhit.fbAuthManager.uid);
	return exists;
}

rhit.User = class {
	constructor(uid, firstName, lastName, roseEmail, phoneNumber) {
		this.uid = uid;
		this.firstName = firstName;
		this.lastName = lastName;
		this.roseEmail = roseEmail;
		this.phoneNumber = phoneNumber;
	}
}

rhit.CarDetails = class {
	constructor (make, model, year, color, licensePlate) {
		this.make = make;
		this.model = model;
		this.year = year;
		this.color = color;
		this.licensePlate = licensePlate;
	}
}

rhit.FbRiderManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_RIDER_ACCOUNTS);
		this._unsubscribe = null;
		this._userFields = [];
		this._roseEmail = null;
		this._firstName = null;
		this._lastName = null;
		this._phoneNumber = null;
	}
	add(username, firstName, lastName, phoneNumber, roseEmail) {

		this._ref.doc(username).set({
			[rhit.FB_RIDER_KEY_FIRSTNAME]: firstName,
			[rhit.FB_RIDER_KEY_LASTNAME]: lastName,
			[rhit.FB_RIDER_KEY_PHONENUMBER]: phoneNumber,
			[rhit.FB_RIDER_KEY_ROSEEMAIL]: roseEmail
		})
			.then(() => {
				console.log("Document written");
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
			});
	}

	docIdExists(docId) {
		return this._ref.doc(docId).get().then((docSnapshot) => {
			if (docSnapshot.exists) {
				console.log(`Document ${docId} exists:`, docSnapshot.data());
				return true;
			} else {
				console.log("No such document!");
				return false;
			}
		}).catch((error) => {
			console.log("Error checking document:", error);
			return false;  // Return false in case of error
		});
	}

	getRiderInfo() {
		const documentRef = this._ref.doc(rhit.fbAuthManager.uid);
		return documentRef.get().then((docSnapshot) => {
			if (docSnapshot.exists) {
				// Document data will be in docSnapshot.data()
				this._userFields = docSnapshot.data();
				const data = docSnapshot.data();
				console.log("Document data:", data);
				return this._userFields;
			} else {
				console.log("No such document!");
				return null; // Explicitly return null if the document doesn't exist
			}
		}).catch((error) => {
			console.error("Error getting document:", error);
			throw error; // Rethrow the error so it can be caught in the calling function
		});
	}


	beginListening(changeListener) {


		const documentRef = this._ref.doc(rhit.fbAuthManager.uid);

		documentRef.get().then((docSnapshot) => {
			if (docSnapshot.exists) {
				// Document data will be in docSnapshot.data()
				this._userFields = docSnapshot.data();
				const data = docSnapshot.data();
				console.log("Document data:", data);
				return this._userFields;
			} else {
				console.log("No such document!");
			}
		}).catch((error) => {
			console.error("Error getting document:", error);
		});

		// this._unsubscribe = this._ref
		// 	.onSnapshot((querySnapshot) => {
		// 		this._documentSnapshots = querySnapshot.docs;
		// 		// querySnapshot.forEach((doc) => {
		// 		//     console.log(doc.data);
		// 		// });
		// 		changeListener();
		// 	});

	}
	stopListening() {
		this._unsubscribe();
	}
	get length() {
		return this._documentSnapshots.length
	}

	// get userInfo(uid){

	// }
}

rhit.RiderRegistrationPageController = class {

	constructor(uid) {
		this.userId = uid;
		this.roseEmail = uid + "@rose-hulman.edu";
		console.log("rider registration controller. User ID: ", uid);
		// let roseEmail = uid + "@rose-hulman.edu";

		document.querySelector("#username").value = this.userId;

		document.querySelector("#roseEmail").value = this.roseEmail;

		document.querySelector("#exitButton").addEventListener("click", (event) => {
			console.log("clicked Exit");
			rhit.fbAuthManager.signOut();
		});

		document.querySelector("#signUpButton").addEventListener("click", (event) => {
			console.log("clicked Sign Up");
			let firstName = document.querySelector("#firstName").value;
			let lastName = document.querySelector("#lastName").value;
			let phoneNumber = document.querySelector("#phoneNumber").value;
			rhit.fbRiderManager.add(this.userId, firstName, lastName, phoneNumber, this.roseEmail);
			window.location.href = `/riderDashboard.html?uid=${rhit.fbAuthManager.uid}`;
		});

	}

}

rhit.DriverRegistrationPageController = class {

	constructor(uid) {
		this.userId = uid;
		this.roseEmail = uid + "@rose-hulman.edu";
		console.log("driver registration controller. User ID: ", uid);
		const riderInfo = this.createDriverDetails();
		document.querySelector("#username").value = this.userId;
		document.querySelector("#roseEmail").value = this.roseEmail;



		document.querySelector("#exitButton").addEventListener("click", (event) => {
			console.log("clicked Exit");
			window.history.back();
		});

		document.querySelector("#signUpButton").addEventListener("click", (event) => {
			console.log("clicked Sign Up");
			let firstName = document.querySelector("#firstName").value;
			let lastName = document.querySelector("#lastName").value;
			let phoneNumber = document.querySelector("#phoneNumber").value;
			let model = document.querySelector("#model").value;
			let make = document.querySelector("#make").value;
			let year = document.querySelector("#year").value;
			let color = document.querySelector("#color").value;
			let licensePlate = document.querySelector("#licensePlate").value;
			let carDetails = new rhit.CarDetails(make, model, year, color, licensePlate);
			rhit.fbDriverManager.add(this.userId, firstName, lastName, phoneNumber, this.roseEmail, carDetails);
		});
	}

	async createDriverDetails() {
		try {
			const riderData = await rhit.fbRiderManager.getRiderInfo()
			if (riderData) {
				document.querySelector("#firstName").value = riderData.firstName;
        		document.querySelector("#lastName").value = riderData.lastName;
        		document.querySelector("#phoneNumber").value = riderData.phoneNumber;
				return;
			}
	
		} catch (error) {
			console.error('Error creating driver profile:', error);
		}
	}


}

rhit.riderRequest = class {
	constructor(id, destination, driver, pickUpLocation, pickUpTime, price, riders) {
		this.id = id;
		this.destination = destination;
		this.driver = driver;
		this.pickUpLocation = pickUpLocation;
		this.pickUpTime = pickUpTime;
		this.price = price;
		this.riders = riders;
	}
}

rhit.FbRideListManager = class {
	constructor(uid) {
		this._uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_RIDES);
		this._unsubscribe = null;
	}

	add(destination, driver, pickUpLocation, pickUpDateTime, price) {

		// Add a new document with a generated id.
		this._ref.add({
			[rhit.FB_RIDES_KEY_DESTINATION]: destination,
			[rhit.FB_RIDES_KEY_DRIVER]: driver,
			[rhit.FB_RIDES_KEY_PICKUPLOCATION]: pickUpLocation,
			[rhit.FB_RIDES_KEY_PICKUPTIME]: firebase.firestore.Timestamp.fromDate(new Date(pickUpDateTime)),
			[rhit.FB_RIDES_KEY_PRICE]: price,
			[rhit.FB_RIDES_RIDER]: this._uid
		})
			.then((docRef) => {
				console.log("Document written with ID: ", docRef.id);
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
			});
	}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_RIDES_KEY_PICKUPTIME, "desc").limit(50)
		if (this._uid) {
			query = query.where(rhit.FB_RIDES_RIDER, "==", this._uid);
		}

		this._unsubscribe = query
			.onSnapshot((querySnapshot) => {
				console.log("Ride List Update");
				this._documentSnapshots = querySnapshot.docs;
				// 	querySnapshot.forEach((doc) => {
				// 		console.log(doc.data());
				// });
				changeListener();
			});
	}
	stopListening() {
		this._unsubscribe();
	}
	get length() {
		return this._documentSnapshots.length;
	}
	getRideAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const rq = new rhit.riderRequest(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_RIDES_KEY_DESTINATION),
			docSnapshot.get(rhit.FB_RIDES_KEY_DRIVER),
			docSnapshot.get(rhit.FB_RIDES_KEY_PICKUPLOCATION),
			docSnapshot.get(rhit.FB_RIDES_KEY_PICKUPTIME),
			docSnapshot.get(rhit.FB_RIDES_KEY_PRICE),
			docSnapshot.get(rhit.FB_RIDES_RIDER),
		);
		return rq;
	}
}

rhit.FbRiderRequestManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_RIDES);
		this._unsubscribe = null;
	}

	add(destination, driver, pickUpLocation, pickUpTime, price, riders) {

		// Add a new document with a generated id.
		this._ref.add({
			[rhit.FB_RIDES_KEY_DESTINATION]: destination,
			[rhit.FB_RIDES_KEY_DRIVER]: driver,
			[rhit.FB_RIDES_KEY_PICKUPLOCATION]: pickUpLocation,
			[rhit.FB_RIDES_KEY_PICKUPTIME]: pickUpTime,
			[rhit.FB_RIDES_KEY_PRICE]: price,
			[rhit.FB_RIDES_SUBCOLLECTION]: riders
		})
			.then((docRef) => {
				console.log("Document written with ID: ", docRef.id);
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
			});
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref
			.orderBy(rhit.FB_RIDES_KEY_PICKUPTIME, "desc")
			.limit(50)
			.onSnapshot((querySnapshot) => {
				console.log("Rider Request Update");
				this._documentSnapshots = querySnapshot.docs;
				// 	querySnapshot.forEach((doc) => {
				// 		console.log(doc.data());
				// });
				changeListener();
			});
	}
	stopListening() {
		this._unsubscribe();
	}
	get length() {
		return this._documentSnapshots.length;
	}
	getRiderRequestAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const rq = new rhit.riderRequest(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_RIDES_KEY_DESTINATION),
			docSnapshot.get(rhit.FB_RIDES_KEY_DRIVER),
			docSnapshot.get(rhit.FB_RIDES_KEY_PICKUPLOCATION),
			docSnapshot.get(rhit.FB_RIDES_KEY_PICKUPTIME),
			docSnapshot.get(rhit.FB_RIDES_KEY_PRICE),
			docSnapshot.get(rhit.FB_RIDES_SUBCOLLECTION),
		);
		return rq;
	}
	delete() {
		return this._ref.delete();
	}
}

rhit.DriverDashboardController = class {
	constructor() {
		document.querySelector("#submitAddRide").addEventListener("click", async (event) => {
			const destination = document.querySelector("#inputDestination").value;
			const pickUpLocation = document.querySelector("#inputPickUpLocation").value;
			const pickUpDate = document.querySelector("#inputPickUpDate").value;
			const pickUpTime = document.querySelector("#inputPickUpTime").value;
			const pickUpDateTime = this.convertToDatetimeLocal(pickUpDate, pickUpTime);
			rhit.fbRideListManager.add(destination, "", pickUpLocation, pickUpDateTime, 0)
			this.updateList();
		});

		$("#addDriveDialog").on("show.bs.modal", (event) => {
			// Pre-animation
			document.querySelector("#inputDestination").value = "";
			document.querySelector("#inputPickUpLocation").value = "";
			document.querySelector("#inputPickUpDate").value = "";
			document.querySelector("#inputPickUpTime").value = "";
		});
		$("#addDriveDialog").on("shown.bs.modal", (event) => {
			// Post-animation
			document.querySelector("#inputDestination").focus();
		});

		// Start Listening!
		rhit.fbRideListManager.beginListening(this.updateList.bind(this));
		this.updateList();
	}

	convertToDatetimeLocal(pickUpDate, pickUpTime) {
		return pickUpDate.replace(/\s+/g, '') + "T" + pickUpTime.replace(/\s+/g, '');
	}

	updateList() {
		console.log("I need to update the list on the page!");
		console.log(rhit.fbRideListManager.length);
		console.log(rhit.fbRideListManager.getRideAtIndex(0));

		const newList = htmlToElement('<div class="upcoming-rides-container"></div>');
		for (let i = 0; i < rhit.fbRideListManager.length; i++) {
			const rq = rhit.fbRideListManager.getRideAtIndex(i);
			const newCard = this._createCard(rq);

			newCard.onclick = (event) => {
				window.location.href = `/ride.html?id=${rq.id}`;
			}

			newList.appendChild(newCard);
		}
		const oldList = document.querySelector("#upcomingRidesContainer");
		if (oldList) {
			oldList.removeAttribute("id");
			oldList.hidden = true;
			oldList.parentElement.appendChild(newList);
		}
	}

	_createCard(ride) {
		const pickUpTime = ride.pickUpTime.toDate();
		const formattedTime = pickUpTime.toLocaleString('en-US', {
			month: 'long', day: 'numeric', year: 'numeric',
			hour: 'numeric', minute: 'numeric',
			hour12: true
		});
		return htmlToElement(`<div class="card">
            <div class="card-body">
              <h5 class="card-title">${ride.destination}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${formattedTime}</h6>
            </div>
          </div>`);
	}
}

rhit.HomePageController = class {
	constructor() {

		document.querySelector("#menuAboutUs").addEventListener("click", (event) => {
			console.log("clicked About Us");
			window.location.href = "/about.html";
		});

		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			console.log("TODO: Sign out");
			rhit.fbAuthManager.signOut();
		});

		document.querySelector("#menuRiderDashboard").addEventListener("click", (event) => {
			console.log("clicked Rider Dashboard");
			window.location.href = `/riderDashboard.html?uid=${rhit.fbAuthManager.uid}`;
		});

		document.querySelector("#menuDriverDashboard").addEventListener("click", (event) => {
			console.log("clicked Driver Dashboard");
			window.location.href = "/driverRegistration.html";
		});

		document.querySelector("#menuAccountPage").addEventListener("click", (event) => {
			console.log("clicked Account");
			window.location.href = "/accountPage.html";
		});
	}
}

rhit.LoginPageController = class {
	constructor() {
		document.querySelector("#roseFireButton").onclick = (event) => {
			rhit.fbAuthManager.signIn();
		}
	}
}

rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
		console.log("You have made the Auth Manager");
	}

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			if (this._user) {
				console.log("User ID: ", this._user.uid);
			} else {
				console.log("No user is signed in.");
			}
			changeListener();
		});
	}

	signIn() {
		console.log("Sign in using Rosefire");
		Rosefire.signIn("d9efa1c8-6769-44bd-b191-c4c2d0430837", (err, rfUser) => {
			if (err) {
				console.log("Rosefire error!", err);
				return;
			}
			console.log("Rosefire success!", rfUser);

			firebase.auth().signInWithCustomToken(rfUser.token).catch(function (error) {
				const errorCode = error.code;
				const errorMessage = error.message;
				if (errorCode === 'auth/invalid-custom-token') {
					alert('The token you provided is not valid.');
				} else {
					console.error(error);
					console.error("Custom auth error,", errorCode, errorMessage);

				}
			});

			// TODO: Use the rfUser.token with your server.
		});

	}
	signOut() {
		firebase.auth().signOut();
	}
	get uid() { return this._user.uid; }
	get isSignedIn() { return !!this._user; }
}

rhit.RiderDashboardController = class {
	constructor() {
		document.querySelector("#submitAddRide").addEventListener("click", async (event) => {
			const destination = document.querySelector("#inputDestination").value;
			const pickUpLocation = document.querySelector("#inputPickUpLocation").value;
			const pickUpDate = document.querySelector("#inputPickUpDate").value;
			const pickUpTime = document.querySelector("#inputPickUpTime").value;
			const pickUpDateTime = this.convertToDatetimeLocal(pickUpDate, pickUpTime);
			rhit.fbRideListManager.add(destination, "", pickUpLocation, pickUpDateTime, 0)
			this.updateList();
		});

		$("#addDriveDialog").on("show.bs.modal", (event) => {
			// Pre-animation
			document.querySelector("#inputDestination").value = "";
			document.querySelector("#inputPickUpLocation").value = "";
			document.querySelector("#inputPickUpDate").value = "";
			document.querySelector("#inputPickUpTime").value = "";
		});
		$("#addDriveDialog").on("shown.bs.modal", (event) => {
			// Post-animation
			document.querySelector("#inputDestination").focus();
		});

		// Start Listening!
		rhit.fbRideListManager.beginListening(this.updateList.bind(this));
		this.updateList();
	}

	convertToDatetimeLocal(pickUpDate, pickUpTime) {
		return pickUpDate.replace(/\s+/g, '') + "T" + pickUpTime.replace(/\s+/g, '');
	}

	updateList() {
		console.log("I need to update the list on the page!");
		console.log(rhit.fbRideListManager.length);
		console.log(rhit.fbRideListManager.getRideAtIndex(0));

		const newList = htmlToElement('<div class="upcoming-rides-container"></div>');
		for (let i = 0; i < rhit.fbRideListManager.length; i++) {
			const rq = rhit.fbRideListManager.getRideAtIndex(i);
			const newCard = this._createCard(rq);

			newCard.onclick = (event) => {
				window.location.href = `/ride.html?id=${rq.id}`;
			}

			newList.appendChild(newCard);
		}
		const oldList = document.querySelector("#upcomingRidesContainer");
		if (oldList) {
			oldList.removeAttribute("id");
			oldList.hidden = true;
			oldList.parentElement.appendChild(newList);
		}
	}

	_createCard(ride) {
		const pickUpTime = ride.pickUpTime.toDate();
		const formattedTime = pickUpTime.toLocaleString('en-US', {
			month: 'long', day: 'numeric', year: 'numeric',
			hour: 'numeric', minute: 'numeric',
			hour12: true
		});
		return htmlToElement(`<div class="card">
            <div class="card-body">
              <h5 class="card-title">${ride.destination}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${formattedTime}</h6>
            </div>
          </div>`);
	}
}

rhit.RidePageController = class {
	constructor() {
		document.querySelector("#cancelBookingButton").addEventListener("click", (event) => {
			rhit.fbRideDetailManager.delete().then(() => {
				console.log("Document successfully deleted!")
				window.location.href = `/riderDashboard.html?uid=${rhit.fbAuthManager.uid}`
			})
		});

		rhit.fbRideDetailManager.beginListening(this.updateView.bind(this));
	}
	updateView() {
		document.querySelector("#destinationField").innerHTML = rhit.fbRideDetailManager.destination;
		document.querySelector("#driverField").innerHTML += rhit.fbRideDetailManager.driver;
		document.querySelector("#pickupLocationField").innerHTML += rhit.fbRideDetailManager.pickupLocation;
		document.querySelector("#pickupTimeField").innerHTML += rhit.fbRideDetailManager.pickupTime;
		document.querySelector("#priceField").innerHTML += rhit.fbRideDetailManager.price;
		document.querySelector("#riderField").innerHTML += rhit.fbRideDetailManager.rider;
	}
}

rhit.FbRideDetailManager = class {
	constructor(rideId) {
		this._documentSnapshots = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_RIDES).doc(rideId);
	}
	beginListening(changeListener) {
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Document data: ", doc.data());
				this._documentSnapshot = doc;
				changeListener();
			} else {
				console.log("No such document!");
			}
		});
	}
	stopListening() {
		this._unsubscribe();
	}

	addRider(riderId) {
		const ridersRef = this._documentSnapshot.ref.collection(rhit.FB_RIDES_SUBCOLLECTION);

		ridersRef.doc(riderId).set({})
			.then(() => {
				console.log("Rider added with ID: ", riderId);
				alert(`Booking for ${riderId} confirmed!`)
				window.location.href = "/accountPage.html"
			})
			.catch(error => {
				console.error("Error adding rider: ", error);
			});
	}

	delete() {
		return this._ref.delete();
	}

	get destination() {
		return this._documentSnapshot.get(rhit.FB_RIDES_KEY_DESTINATION);
	}
	get driver() {
		return this._documentSnapshot.get(rhit.FB_RIDES_KEY_DRIVER);
	}
	get pickupLocation() {
		return this._documentSnapshot.get(rhit.FB_RIDES_KEY_PICKUPLOCATION);
	}
	get pickupTime() {
		const pickUpTime = this._documentSnapshot.get(rhit.FB_RIDES_KEY_PICKUPTIME).toDate();
		const formattedTime = pickUpTime.toLocaleString('en-US', {
			month: 'long', day: 'numeric', year: 'numeric',
			hour: 'numeric', minute: 'numeric',
			hour12: true
		});
		return formattedTime;
	}
	get price() {
		return "$" + this._documentSnapshot.get(rhit.FB_RIDES_KEY_PRICE);
	}
	get rider() {
		return this._documentSnapshot.get(rhit.FB_RIDES_RIDER);
	}
}

// UPDATE THIS IF NEEDED
rhit.checkForRedirects = async function () {
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
		let exists = await rhit.fbRiderManager.docIdExists(rhit.fbAuthManager.uid);
		if (!exists) { // if not, send user to rider registration
			window.location.href = "/riderRegistration.html";
		} else {
			window.location.href = `/riderDashboard.html?uid=${rhit.fbAuthManager.uid}`;
		}
	}

	if (!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/";
	}

	if (document.querySelector('#riderRegistrationPage') && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/.html";
	}

	if (document.querySelector('#riderRegistrationPage') && rhit.fbAuthManager.isSignedIn) {
		let exists = await rhit.fbRiderManager.docIdExists(rhit.fbAuthManager.uid);
		if (!exists) { // if not, send user to rider registration
			window.location.href = "/riderRegistration.html";
		} else {
			window.location.href = `/riderDashboard.html?uid=${rhit.fbAuthManager.uid}`;
		}
	}

	if (document.querySelector('#driverDashboardPage') && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/.html";
	}

	if (document.querySelector('#driverRegisterPage') && rhit.fbAuthManager.isSignedIn) {
		let exists = await rhit.fbDriverManager.docIdExists(rhit.fbAuthManager.uid);
		if (!exists) { // if not, send user to driver registration
			window.location.href = "#";
		} else {
			window.location.href = "/driverDashboard.html";
		}
	}
};

rhit.initializePage = function () {
	const urlParams = new URLSearchParams(window.location.search);

	if (document.querySelector("#homePage")) {
		console.log("You are on the home page");
		const uid = urlParams.get("uid");

		new rhit.HomePageController();
	}

	if (document.querySelector("#loginPage")) {
		console.log("You are on the login page");
		new rhit.LoginPageController();
	}

	if (document.querySelector("#riderDashboardPage")) {
		console.log("You are on the rider dashboard page");
		const uid = urlParams.get("uid");

		rhit.fbRideListManager = new rhit.FbRideListManager(uid);
		new rhit.HomePageController();
		new rhit.RiderDashboardController();
	}

	if (document.querySelector("#aboutPage")) {
		console.log("You are on the about page");
		const uid = urlParams.get("uid");

		new rhit.HomePageController();
	}

	if (document.querySelector("#driverDashboardPage")) {
		console.log("You are on the driver dashboard page");
		const uid = urlParams.get("uid");

		new rhit.HomePageController();
		new rhit.DriverDashboardController();
		this.fbRiderRequestManager = new rhit.FbRiderRequestManager();
	}

	if (document.querySelector("#riderRegisterPage")) {
		console.log("You are on the rider registration page");
		const uid = urlParams.get("uid");


		new rhit.HomePageController();
		new rhit.RiderRegistrationPageController(rhit.fbAuthManager.uid);
	}

	if (document.querySelector("#driverRegisterPage")) {
		console.log("You are on the driver registration page");
		// const uid = urlParams.get("uid");


		new rhit.HomePageController();
		new rhit.DriverRegistrationPageController(rhit.fbAuthManager.uid);
	}

	if (document.querySelector("#accountPage")) {
		console.log("You are on account page");
		const uid = urlParams.get("uid");

		new rhit.HomePageController();
	}

	if (document.querySelector("#ridePage")) {
		new rhit.HomePageController();
	}
};

/* Main */
/** function and class syntax examples */
rhit.main = function () {

	if (document.querySelector("#ridePage")) {
		const queryString = window.location.search;
		console.log(queryString);
		const urlParams = new URLSearchParams(queryString);
		const rideId = urlParams.get("id");
		if (!rideId) {
			window.location.href = `/riderDashboard.html?uid=${rhit.fbAuthManager.uid}`;
		}

		rhit.fbRideDetailManager = new rhit.FbRideDetailManager(rideId);
		new rhit.RidePageController();
	}

	console.log("Ready");
	rhit.fbRiderManager = new rhit.FbRiderManager();
	rhit.fbDriverManager = new rhit.FbDriverManager();
	rhit.fbAuthManager = new rhit.FbAuthManager();



	rhit.fbAuthManager.beginListening(() => {
		console.log(`isSignedIn = ${rhit.fbAuthManager.isSignedIn}`);
		rhit.checkForRedirects();
		rhit.initializePage();
	});
};

rhit.main();
