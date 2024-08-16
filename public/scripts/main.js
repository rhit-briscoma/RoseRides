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
rhit.FB_DRIVER_KEY_SECONDARYEMAIL = "secondaryEmail";

/** Rides References */
rhit.FB_COLLECTION_RIDES = "rides";
rhit.FB_RIDES_KEY_DESTINATION = "destination";
rhit.FB_RIDES_KEY_DRIVER = "driver";
rhit.FB_RIDES_KEY_PICKUPLOCATION = "pickupLocation";
rhit.FB_RIDES_KEY_PICKUPTIME = "pickupTime";
rhit.FB_RIDES_KEY_PRICE = "price";
rhit.FB_RIDES_SUBCOLLECTION = "ride_riders"

rhit.fbRiderManager = null;
rhit.fbDriverManager = null;

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};

rhit.FbDriverManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_DRIVER_ACCOUNTS);
		this._unsubscribe = null;
		this._userFields = [];
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
	get length() {
		return this._documentSnapshots.length
	}
}

isADriver = async function(docId){
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


		const documentRef = this._ref.doc(rhit.fbAuthManager.uid);

		documentRef.get().then((docSnapshot) => {
			if (docSnapshot.exists) {
				// Document data will be in docSnapshot.data()
				const data = docSnapshot.data()
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

	get userInfo(uid){

	}
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
			window.location.href = "/riderDashboard.html";
		});

	}

}

rhit.DriverRegistrationPageController = class {

	constructor(uid) {
		this.userId = uid;
		this.roseEmail = uid + "@rose-hulman.edu";
		console.log("driver registration controller. User ID: ", uid);
		// let roseEmail = uid + "@rose-hulman.edu";

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
			rhit.fbRiderManager.add(this.userId, firstName, lastName, phoneNumber, this.roseEmail);
			window.location.href = "/riderDashboard.html";
		});

	}

}

rhit.riderDashboardController = class {
	constructor() {
		
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
			window.location.href = "/riderDashboard.html";
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

// UPDATE THIS IF NEEDED
rhit.checkForRedirects = async function () {
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
		let exists = await rhit.fbRiderManager.docIdExists(rhit.fbAuthManager.uid);
		if (!exists) { // if not, send user to rider registration
			window.location.href = "/riderRegistration.html";
		} else {
			window.location.href = "/riderDashboard.html";
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
			window.location.href = "/riderDashboard.html";
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

		new rhit.HomePageController();
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
};

/* Main */
/** function and class syntax examples */
rhit.main = function () {
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
