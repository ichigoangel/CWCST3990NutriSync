  // Send email via emailjs
  function sendMail() {
    var name = document.getElementById("exampleInputName").value;
    var email = document.getElementById("exampleInputEmail2").value;
    var message = document.getElementById("exampleInputMessage").value;

    if (name !== '' && email !== '' && message !== '') {
      const params = { name, email, message };
      const serviceID = "service_rzrxhgl";
      const templateID = "template_o6ierwy";

      emailjs.send(serviceID, templateID, params)
        .then(res => {
          document.getElementById("exampleInputName").value = "";
          document.getElementById("exampleInputEmail2").value = "";
          document.getElementById("exampleInputMessage").value = "";
          console.log(res);
          alert("Your message sent successfully!!");
        })
        .catch(err => console.log(err));
        
    } else {
      alert('Please fill in all the required fields.');
    }
  }

  // Cookie consent
  function acceptCookies() {
    document.getElementById("cookieConsent").style.display = "none";
    localStorage.setItem("cookiesAccepted", "true");
  }

  function declineCookies() {
    document.getElementById("cookieConsent").style.display = "none";
    localStorage.setItem("cookiesAccepted", "false");
  }

  // Show login/signup form on button click
  function showForm(type) {
    const formContainer = document.getElementById('formContainer');
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');

    formContainer.style.display = 'block';
    if (type === 'login') {
      loginSection.style.display = 'block';
      signupSection.style.display = 'none';
    } else {
      signupSection.style.display = 'block';
      loginSection.style.display = 'none';
    }

    formContainer.scrollIntoView({ behavior: 'smooth' });
  }

  // DOM loaded
  document.addEventListener("DOMContentLoaded", function () {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    const progressbar = document.getElementById("progressbar");

    // Hide cookie banner if already accepted or declined
    if (localStorage.getItem("cookiesAccepted") !== null) {
      document.getElementById("cookieConsent").style.display = "none";
    }

    // Scroll logic
    window.addEventListener("scroll", function () {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
      } else {
        scrollToTopBtn.style.display = "none";
      }

      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollTop / scrollHeight) * 100;
      progressbar.style.width = scrolled + "%";
    });

    scrollToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Example dummy user
    const newUser = {
      username: "testuser",
      password: "1234" // WARNING: never store real passwords like this
    };
    localStorage.setItem("testuser", JSON.stringify(newUser));

    // Basic guest access limit (uncomment if needed)
    // if (!localStorage.getItem("loggedInUser")) {
    //   let guestUses = localStorage.getItem("guestUses") || 0;
    //   if (guestUses >= 3) {
    //     alert("Guest access limit reached. Please log in to continue.");
    //     window.location.href = "login.html";
    //   } else {
    //     guestUses++;
    //     localStorage.setItem("guestUses", guestUses);
    //   }
    // }
  });