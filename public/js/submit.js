let toastElement;
// Helper function to show toast
function showWelcomeToast(message, hedingsmg, color) {
  const toastMessageEl = document.getElementById("toastMessage");
  toastElement = document.getElementById("welcomeToast");
  let heding = document.getElementById('heding')

  if (toastMessageEl && toastElement) {
    toastMessageEl.textContent = message;
    heding.textContent = hedingsmg;
    toastElement.classList.remove('bg-success-subtle');
    toastElement.classList.add(color);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  } else {
    console.warn("Toast elements not found in DOM.");
  }
}

// Button loding animation
function loadshow() {
  let load = document.getElementById('load');
  let svg = document.getElementById('svg')
  svg.classList.add('hidde')
  load.classList.remove('hidde')
  setTimeout(() => {
    load.classList.add('hidde')
    svg.classList.remove('hidde')
  }, 500);
}

// toast function calling function 
function excuttoast(message, hedingsmg, color) {
  showWelcomeToast(message, hedingsmg, color);
}

document.addEventListener("DOMContentLoaded", () => {

  let boss = localStorage.getItem("boss");
  let name1 = localStorage.getItem("name1");
  let sirname = localStorage.getItem("sirname");
  // let userMail = localStorage.getItem("mail");

  const pageId = document.body.id;

  if (pageId === 'home-page') {

    let manu = document.getElementById('manu')
    let close = document.getElementById('Close')

    let t1 = gsap.timeline();

    t1.from('#full-nav-ul #full-links', {
      opacity: 0,
      duration: 0.3,
      stagger: 0.2,
      x: 170
    })
    t1.pause()

    manu.addEventListener("click", function (e) {
      t1.play();
    })
    close.addEventListener("click", function (e) {
      t1.reverse(-1);
      t2.reverse(-1);
      tempnumber=0;
      // t1.kill();
    })


    showWelcomeToast('Wellcom ' + boss + ': ' + name1 + ' ' + sirname, 'Login succsefull', 'bg-success-subtle'); // Show success message

    const inputsearch = document.getElementById('search');
    const datalist = document.getElementById('suggestions');
    const searchbutton = document.getElementById('button')

    let lat1;
    let lng1;
    let t;
    let search2;
    let finelsearch;
    let data;
    let programrun = true;

    inputsearch.addEventListener('input', function (value1) {
      if (programrun) {
        search2 = value1.target.value;
        clearTimeout(t);

        // Show loader, hide icon
        svg.classList.add('hidde');
        load.classList.remove('hidde');

        if (search2 == 0) {
          loadshow();
          showWelcomeToast('Input filde is empty', 'Error', 'bg-danger')
        } else {
          t = setTimeout(function () {
            fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${search2}&lang=en&limit=7&format=json&apiKey=3dfc97b4a1ce4b43bbead926d3e6933b`)
              .then(response => response.json())
              .then(result => {
                console.log('API Result:', result);
                data = result;
                console.log(data);


                datalist.innerHTML = ''; // Clear previous options

                if (result.results && result.results.length > 0) {
                  result.results.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.formatted;
                    datalist.appendChild(option);
                  });
                  programrun = false;
                } else {
                  console.log('No results found');
                  excuttoast('Results Not Found', 'Error', 'bg-warning')
                }
              })
              .catch(error => {
                showWelcomeToast('Internet connection error', 'Error', 'bg-danger')
                console.error(error);
                // toastElement.classList.remove('bg-success-subtle');
                // toastElement.classList.add('bg-danger');
              })
              .finally(() => {
                // Always hide loader and show icon after request completes
                load.classList.add('hidde');
                svg.classList.remove('hidde');
              });
          }, 1600);
        }
      }

    });

    inputsearch.addEventListener('change', function () {
      const selectedValue = inputsearch.value;

      finelsearch = selectedValue
      console.log(selectedValue)
      console.log(data)
      if (data && data.results) {
        for (let j = 0; j < data.results.length; j++) {
          if (data.results[j].formatted === selectedValue) {
            lat1 = data.results[j].lat;
            lng1 = data.results[j].lon;
            // console.log('Lat:', lat1);
            // console.log('Lon:', lng1);

          }
        }
      }
      programrun = true; // Allow new API calls on input change
    });

    searchbutton.addEventListener('click', async function () {
      const response = await fetch("/redirect1", {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lat1, lng1, finelsearch }),
      });
      console.log(lat1, lng1, finelsearch);

      const data = await response.json();
      console.log('Response:', response);
      console.log('data:', data);

      if (data.lat == undefined && data.lng == undefined) {
        showWelcomeToast('Please select location on dynamic list', 'Less info', 'bg-warning')
      } else {
        window.location.href = data.redirectto
        console.log('redirectpage:' + data.lat, data.lng);
      }
    })

  }

  // -------------------------------------------------------------------------------------------------------------------
  // Gallery page loade
  if (pageId === 'gallerypage') {
    if (window.location.pathname === "/gallery") {
      fetch("/api/gallery")
        .then((response) => response.json())
        .then((data) => {
          const gallery = document.getElementById("gallery1");
          data.forEach((place) => {
            const placescard = `
                       <div class="col-md-4">
                           <div class="card mb-4">
                               <img src="${place.image_url}" class="card-img-top" alt="${place.name}">
                               <details class="card-body">
                                   <summary class="card-title">${place.name}</summary>
                                   <p class="card-text">${place.description}</p>
                               </details>
                           </div>
                       </div>
                       `;
            gallery.innerHTML += placescard;
          });
        })
        .catch((error) => {
          console.error("Error fetching plasec images:", error);
          const gallery = document.getElementById("gallery1");
          gallery.innerHTML = `<div class="alert alert-danger">Error fetching images: ${error.message}</div>`;
        });
    }
  }



  //-----------------------------------------------------------------------------------------------------------------------------------------------

  // login frontend js code
  if (pageId === 'loginpage') {

    localStorage.clear()

    const loginform = document.getElementById("loginform")
    loginform.addEventListener("submit", async (event) => {
      event.preventDefault();
      const mail = document.getElementById("email").value;
      const pass = document.getElementById("password").value;

      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail, pass }),
      });

      const data = await response.json();
      console.log('Response:', data);
      toastdata = data

      const specialName = ['Dwarkesh', 'Ankit', 'Bhavesh', 'suraj']

      if (!response.ok) {
        alert(data.message, data.error); // Show error message
      } else {
        if (specialName.includes(data.name)) {
          window.location.href = data.redirectto; // Redirect after login
          localStorage.setItem('boss', data.boss)
          localStorage.setItem('name1', data.name)
          localStorage.setItem('sirname', data.sirname2)
          localStorage.setItem('mail', data.mail)
          
        } else {
          window.location.href = data.redirectto; // Redirect after login
          const mr = 'Mr';
          localStorage.setItem('boss', mr)
          localStorage.setItem('name1', data.name)
          localStorage.setItem('sirname', data.sirname2)
          localStorage.setItem('mail', data.mail)
        }
      }
    });

  }

});
//   -----------------------------------------------------------------------------------------------------------------------------------------
// sing-in js frontend code

// document.getElementById("singin-form").addEventListener("submit", async (event) => {
//   event.preventDefault();
//   const name = document.getElementById("name").value;
//   const sirname = document.getElementById("sirname").value;
//   const mailid = document.getElementById("email").value;
//   const contact = document.getElementById("contact").value;
//   const question = document.getElementById("question").value;
//   const ansewer = document.getElementById("ansewer").value;
//   const pass = document.getElementById("fist-password").value;
//   const confirm = document.getElementById("confirm-password").value;

//   const response = await fetch("/sing", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name, sirname, mailid, contact, question, ansewer, pass, confirm }),
//   });


//   const data = await response.json();
//   console.log('Response', data);

//   alert("Note: take screenshot of your security question and ansewer")

//   if (!response.ok) {
//     alert(data.message); // Show error message
//   } else {
//     if (pass == confirm) {
//       console.log('true');
//       alert(data.message)
//       window.location.href = data.redirectto; // Redirect after login
//     } else {
//       console.log('false');
//       alert(data.message)
//     }
//   }
// });

// ----------------------------------------------------------------------------------------------------------------------------------------
// home pleace searchbar script
// const inputsearch = document.getElementById('search');
// const datalist = document.getElementById('suggestions');


// let lat1;
// let lng1;
// let t;
// let search2;
// let data;
// let programrun = true;

// inputsearch.addEventListener('input', function (value1) {
//   if (programrun) {
//     search2 = value1.target.value;
//     clearTimeout(t);
//     t = setTimeout(function () {
//       fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${search2}&lang=en&limit=7&format=json&apiKey=3dfc97b4a1ce4b43bbead926d3e6933b`)
//         .then(response => response.json())
//         .then(result => {
//           console.log('Api:', result);
//           data = result;
//           // Clear previous options
//           datalist.innerHTML = '';
//           if (result.results && result.results.length > 0) {
//             for (let i = 0; i < result.results.length; i++) {
//               let formatted = result.results[i].formatted;

//               const newOption = document.createElement('option');
//               newOption.value = formatted;
//               datalist.appendChild(newOption);
//             }
//             programrun = false; // Prevent further API calls until the input changes
//           }
//         });
//     }, 1600);
//   }
// });

// inputsearch.addEventListener('change', function () {
//   const selectedValue = inputsearch.value;
//   for (let j = 0; j < data.results.length; j++) {
//     if (data.results[j].formatted == selectedValue) {
//       let lon = data.results[j].lon
//       let lat = data.results[j].lat
//       console.log('lan:', lat)
//       console.log('lon:', lon)
//       lat1 = lat; lng1 = lon;
//     }
//   }
//   programrun = true; // Allow new API calls on input change
//   // console.log('Data:', data.results);
// });
