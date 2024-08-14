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

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};

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
		// console.log("You have made the Auth Manager");
	}

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			console.log("User ID: ", this._user.uid);
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

			firebase.auth().signInWithCustomToken(rfUser.token).catch(function(error) {
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
rhit.checkForRedirects = function() {
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn){
		window.location.href = "/template.html";
	}

	if (!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn){
		window.location.href = "/";
	}
};

rhit.initializePage = function() {
	const urlParams = new URLSearchParams(window.location.search);

	if (document.querySelector("#homePage")) {
		console.log("You are on the home page");
		const uid = urlParams.get("uid");
		rhit.fbMovieQuotesManager = new rhit.FbMovieQuotesManager(uid);
		new rhit.ListPageController();
	}

	if (document.querySelector("#detailPage")) {
		const movieQuoteId = urlParams.get("id");

		if (!movieQuoteId) {
			console.log("Error! Missing movie quote id!");
			window.location.href = "/";
		}
		rhit.fbSingleQuoteManager = new rhit.FbSingleQuoteManager(movieQuoteId);
		new rhit.DetailPageController();
	}

	if (document.querySelector("#loginPage")) {
		console.log("You are on the login page");
		new rhit.LoginPageController();
	}
};

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		console.log(`isSignedIn = ${rhit.fbAuthManager.isSignedIn}`);
		rhit.checkForRedirects();
		rhit.initializePage();

	});
};

rhit.main();
