var db = null; 
var storage = null;
var auth = null;
let toastContainer = document.getElementById('toastContainer');
const colorThief = new ColorThief();
let userInfo = {};
let uploadBtn;
document.getElementById('stickyMenu').innerHTML = menuHTML;
document.getElementById('stickyMenu').classList.add('sticky-top');


window.addEventListener('load',()=>{
    db = firebase.firestore(); 
    storage = firebase.storage();
    auth = firebase.auth();
    auth.onAuthStateChanged((user)=>{
        menuOptions(user);
        if(user){
            document.getElementById('uploadModalContainer').innerHTML = uploadHTML;
            uploadBtn = document.getElementById('uploadButton');
            document.getElementById('floatButton').classList.add('fixed-bottom');
            document.getElementById('floatButton').style.bottom = '10px';
            document.getElementById('floatButton').style.right = '10px';
            document.getElementById('floatButton').style.left = 'unset';
            document.getElementById('floatButton').innerHTML = uploadFloatButton;
        }
        else{
            document.getElementById('floatButton').children[0].remove();
        }
    });
});

/*MENU UTILITIES */

//Get the user logged info and check if there are any user logged in the app null if there no user logged.
function user(){
    const user = auth.currentUser;
    return user;
}

//fill the menu profile options and show depends on Auth firebase object 
function menuOptions(user){
    if(user){
        let navAction = document.querySelector('#dropdown');
        for(const item of navAction.children){
            item.style.display = 'none';
        }
        let profileElement = document.createElement('a');
        profileElement.href = '/u';
        profileElement.textContent = 'My profile';
        profileElement.classList.add('dropdown-item');
        let uploadElement = document.createElement('a');
        //data-bs-toggle="modal" data-bs-target="#profileDetailsModal"
        uploadElement.setAttribute('data-bs-toggle','modal');
        uploadElement.setAttribute('data-bs-target','#uploadModal');
        uploadElement.href = 'javascript:void(0)';
        uploadElement.textContent = 'Upload';
        uploadElement.classList.add('dropdown-item','d-none','d-sm-none','d-md-none','d-lg-block','d-xl-block');

        let signOutElement = document.createElement('a');
        signOutElement.classList.add('dropdown-item');
        signOutElement.href = "javascript:void(0)";
        signOutElement.textContent = 'Sign Out';
        signOutElement.setAttribute('onclick','logout()');
        navAction.appendChild(profileElement);
        navAction.appendChild(uploadElement);
        navAction.appendChild(signOutElement);
    }
    else{
        let navAction = document.querySelector('#dropdown');
        for(const item of navAction.children){
            if(item != navAction.querySelector('#loginForm') || item != navAction.querySelector('#signUp') || item != navAction.querySelector('.dropdown-divider')){
                item.style.display = 'none';
            }
        }
        navAction.querySelector('#loginForm').style.display = 'block';
        navAction.querySelector('#signUp').style.display = 'block';
        navAction.querySelector('.dropdown-divider').style.display = 'block';
    }
}

//Logout function, logout user.
function logout(){
    firebase.auth().signOut().then(() => {
        toast('Succesfully logged out',1000,'logged out');
    }).catch((error) => {
        // An error happened.
    });
}

//Menu dropdown animation icon, when dropdown shows, the icon changed to a fill version.
var myDropdown = document.getElementById('myDropdown');
myDropdown.addEventListener('show.bs.dropdown', function () {
    document.getElementById('dropdownMenuButton').classList.remove('bi-person');
    document.getElementById('dropdownMenuButton').classList.add('bi-person-fill');
});
myDropdown.addEventListener('hide.bs.dropdown', function () {
    document.getElementById('dropdownMenuButton').classList.remove('bi-person-fill');
    document.getElementById('dropdownMenuButton').classList.add('bi-person');
});

//Login using email and password
document.getElementsByTagName('form')[0].addEventListener('submit',(event)=>{
    event.preventDefault();
    const form = event.target;
    //console.log(form);
    if((event.target).checkValidity()){
        auth.signInWithEmailAndPassword(form.email.value, form.password.value)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            toast('Welcome!',3000,'logged');
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error);
            toast(error.message, 5000, 'logged out');
        });
    }
});
//Login using google
function loginUsingGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.languageCode = (navigator.language).substr(0,(navigator.language).indexOf('-')) || (navigator.userLanguage).substr(0,(navigator.userLanguage).indexOf('-'));
    //console.log((navigator.language).substr(0,(navigator.language).indexOf('-')) || (navigator.userLanguage).substr(0,(navigator.userLanguage).indexOf('-')));
    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        console.warn(result.user);
        toast('Welcome!',3000,'logged');
    }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        toast(error.message, 5000, 'logged out');
        console.error(error);
        // ...
    });
}


/* GENERAL UTILITIES */

//Gives the difference in seconds, minutes, hours and days between the current date and the given date, if the difference is more than a month just show the date.
function daysAgo(date){
    var difference = Date.now() - date;

    var daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    var hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    var minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    var secondsDifference = Math.floor(difference/1000);

    if(daysDifference>30){
        return (new Date(date)).toDateString();
    }
    else if(daysDifference>0){
        return daysDifference + ' day/s ago';
    }
    else if(hoursDifference>0){
        return hoursDifference+ ' hour/s ago';
    }
    else if(minutesDifference>0){
        return minutesDifference+ ' minute/s ago';
    }
    else if(secondsDifference>0){
        return secondsDifference+ ' second/s ago';
    }
    
}

function charCounter(str){
    let total = str.length;
    return total;
}
function myAlert(text,time){
    let alert = document.createElement('div');
    alert.classList.add('alert','alert-success','fade','show','position-absolute','top-0','start-50','translate-middle-x');
    alert.style.zIndex = '5';
    alert.style.width = '100%';
    alert.setAttribute('role','alert')
    alert.textContent = text;
    document.getElementById('alertContainer').appendChild(alert);
    var bsAlert = new bootstrap.Alert(alert)
    if(!time){
        setTimeout(()=>{
            bsAlert.close();
        },1000);
    }
    else{
        setTimeout(()=>{
            bsAlert.close();
        },time);
    }
}
function resize(file,size,element){
    //define the width to resize e.g 600px
    var resize_width = size;//without px

    let a;

    //get the image selected
    var item = file;
  
    //create a FileReader
    var reader = new FileReader();
  
    //image turned to base64-encoded Data URI.
    reader.readAsDataURL(item);
    reader.name = item.name;//get the image's name
    reader.size = item.size; //get the image's size
    reader.onload = function(event) {
      var img = new Image();//create a image
      img.src = event.target.result;//result is base64-encoded Data URI
      img.name = event.target.name;//set name (optional)
      img.size = event.target.size;//set size (optional)
      img.onload = function(el) {
        var elem = document.createElement('canvas');//create a canvas
  
        //scale the image to 600 (width) and keep aspect ratio
        var scaleFactor = resize_width / el.target.width;
        elem.width = resize_width;
        elem.height = el.target.height * scaleFactor;
  
        //draw in canvas
        var ctx = elem.getContext('2d');
        ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
  
        //get the base64-encoded Data URI from the resize image
        var srcEncoded = ctx.canvas.toDataURL('image/jpeg', 1);

        element.src = srcEncoded;
        console.log(elem.width,elem.height);
        //assign it to thumb src
        /*Now you can send "srcEncoded" to the server and
        convert it to a png o jpg. Also can send
        "el.target.name" that is the file's name.*/
  
      }
    }
}

function pickTextColorBasedOnBgColorAdvanced(bgColor, lightColor, darkColor) {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    var uicolors = [r / 255, g / 255, b / 255];
    var c = uicolors.map((col) => {
      if (col <= 0.03928) {
        return col / 12.92;
      }
      return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
    return (L > 0.179) ? darkColor : lightColor;
}

function clipboardShareLinkProfile(id){
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
      } catch (err) {
        console.log('Oops, unable to copy');
      }
}

function toast(text,time,type){
    let toastType = 'bi bi-emoji-neutral';
    switch (type) {
        case 'clipboard':
            toastType = 'bi bi-clipboard-check';
            break;
        case 'logged':
            toastType = 'bi bi-person-check';
            break;
        case 'logged out':
            toastType = 'bi bi-person-x';
            break;
        case 'img updated':
            toastType = 'bi bi-person-square';
            break;
        case 'upload failed':
            toastType = 'bi bi-cloud-arrow-up';
            break;
    }
    let toastHTML =
    '<div class=\"toast align-items-center\" role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\" >' +
        '<div class=\"fs-6\">'+
            '<div class=\"row\" style=\"height:60px;\">'+
                '<div class=\"col-auto d-flex align-items-center bg-secondary '+toastType+' text-light rounded-start\">'+
                '</div>'+
                '<div class=\"col d-flex align-items-center\">'+
                    text+
                '</div>'+
                '<div class=\"col-auto d-flex align-items-center border-start\">'+
                    '<a class=\"me-2 text-decoration-none link-dark fw-bolder\" data-bs-dismiss=\"toast\" aria-label=\"Close\" href=\"javascript:void(0)\">Dismiss</a>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';

    toastContainer.innerHTML = toastHTML;
    toastContainer.style.zIndex = '1050';
    let toast = new bootstrap.Toast(toastContainer.querySelector('.toast'),{animation:true,autohide:true,delay:time||1000});
    toast.show();
}


/* USER INFO FUNCTIONS */

function getImageURL(storage,id,element){
    console.info(id);
    var pathReference = storage.ref('userPhotos/'+id+'/profileImage.jpg');
    pathReference.getDownloadURL()
    .then((url) => {
        element.src = url;
    })
    .catch((error) => {
        if (error.code === 'storage/object-not-found'){
            element.src = 'staticFiles/profileImageDefault.png';
        }
        else{
            console.error(error.message);
        }
        
    });
}
function getUserInfo(db,id,profile){
    db.collection("user").doc(id).get().then((doc) => {
        if (doc.exists) {
            console.warn(userInfo);
            loadUserInfo(doc.data());
            if (profile) getUserPosts(id);
            //return doc.data();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }            
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

}
function loadUserInfo(obj){
    let details = document.getElementById('detailsContainer');
    console.log(details.children);
    for(let i=0;i<details.children.length;i++){
        //console.log(details.children[i]);
        switch (details.children[i].id) {
            case 'profileDetailsUsername':
                details.children[i].getElementsByTagName('a')[0].textContent = obj.username || details.children[i].textContent ;
                details.children[i].getElementsByTagName('a')[0].href = 'u?id='+userInfo.id;
                document.getElementsByTagName("title")[0].innerText=(obj.username || details.children[i].textContent) + "'s profile";
            break;
            case 'profileMinDetails':
                if(obj.gender==0){
                    (details.children[i]).querySelector('#profileDetailsGender').textContent = 'Female'; 
                    
                    (details.children[i]).querySelector('#profileDetailsGender').innerHTML += '&#9792;'; 
                }
                else if(obj.gender==1){
                    (details.children[i]).querySelector('#profileDetailsGender').textContent = 'Male'; 
                    
                    (details.children[i]).querySelector('#profileDetailsGender').innerHTML += '&#9794;'; 
                }
                else{
                    (details.children[i]).querySelector('#profileDetailsGender').textContent = 'No specify '; 
                    (details.children[i]).querySelector('#profileDetailsGender').innerHTML += '&#9793;'; 
                }
            break;
            case 'profileDetailsDesc':
                details.children[i].textContent = (obj.desc).substr(0,100)||details.children[i].textContent + '...';;
            break;
            case 'creationTime':
                
                if(obj.creationTime){
                    const date = new Date(obj.creationTime);
                    const month = new Intl.DateTimeFormat(navigator.language || navigator.userLanguage, {month: 'long'}).format(date);
                    (details.children[i]).textContent = 'User since '+ month + ' ' + date.getFullYear();
                }
                else{
                    (details.children[i]).textContent = '';
                }
            break;
        }
    }
    if(!id){
        document.getElementById('copyLink').setAttribute('data-clipboard-text',window.location.href+'?id='+user().uid);
    }
    else{
        document.getElementById('copyLink').setAttribute('data-clipboard-text',window.location.href);
    }
}

/* UPLOAD FUNCTIONS */
function uploadFiles(file,date){
    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storage.ref().child('audio/'+user().uid+'/'+date+'/'+file.name).put(file);
    document.querySelector('#progressBar').style.display = 'flex';
    document.querySelector('#uploadFile').style.display = 'none';
    document.querySelector('#uploadButton').classList.add('disabled');
    document.querySelector('#uploading').textContent = 'Uploading the file, please wait';
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log('Upload is ' + progress + '% done');
        changeProgressBar(progress);
        //document.getElementById("progressBar").setAttribute("data-value",progress);
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
            break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
            break;
            }
    }, function(error) {
        cleanView();
        toast(error.message,2000,'upload failed');
    }, function() {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            obj.fileURL = downloadURL;
            obj.userId = user().uid;
            obj.date = date;
            obj.fileName = file.name;
            db.collection("post").add(obj)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef);
                document.querySelector('#progressBar').children[0].classList.toggle('bg-success');
                document.querySelector('#menuAction').style.display = 'block';
                document.querySelector('#toAudio').href = '/post?id='+docRef.id;
                if((window.location.href).indexOf('u')!=-1){
                    createElement(docRef.id,obj);
                }
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        });
    });
}
function cleanView(){
    document.querySelector('#uploading').textContent = 'Upload your audio';
    document.querySelector('#progressBar').children[0].classList.toggle('bg-success');
    document.querySelector('#progressBar').style.display = 'none';
    document.querySelector('#menuAction').style.display = 'none';
    document.querySelector('#uploadFile').style.display = 'block';
    
    document.querySelector('#uploadButton').classList.remove('disabled');
    //document.querySelector('#uploadButton').disabled = true;
    //document.querySelector('#uploadButton').childNodes[0].style.display = 'none';
    document.querySelector('#uploadFile').reset();

}
function changeProgressBar(progress){
    let bar = document.querySelector('#progressBar').children[0];
    bar.style.width = progress + "%";
    bar.setAttribute('aria-valuenow',progress);
    bar.textContent = Math.floor(progress)  + "%";
}
function loadUpload(){
    let form = document.getElementById('uploadFile');
    obj={"title":form.title.value,"desc":form.desc.value,"nsfw":form.nsfw.checked};
    let file = form.file.files[0];
    if(form.reportValidity() && (file.type).includes('audio') && ((file.size/1024)/1024)<=60){
        uploadFiles(file,Date.now());
    }
}
function checkSize(element){
    let file = element.files[0];
    if(((file.size/1024)/1024)>60){
        element.setCustomValidity('File size exceeds 60MB');
    }
}