(() => {

    /*----------Map API--------------*/

    function initMap() {

        var mapOptions = {
            zoom: 13,
            center: { lat: 13.736717, lng: 100.523186 }
        };
        const map = new google.maps.Map(document.getElementById("map"), mapOptions);
        const input = document.querySelector('#searchInput');

        let markers = [];
        let infowindows = [];

        /*-------<Style----------*/
        const font = `style="font-family: 'Mitr', sans-serif"`;
        const bt = `style="font-family: 'Mitr', sans-serif;float: right;background-color: #00A8B6;color: #fff;padding: 5px 10px;border-radius: 5px"`
        /*-------Style>----------*/

        /*---------------function ปักมุด----------------*/

        function addMarker(property) {
            const marker = new google.maps.Marker({
                position: { lat: property.latitude, lng: property.longitude },
                map: map,
                icon: 'http://lab.digitiv.net/phai/ic-location.png',
                title: property.name_store
            });

            if (property.address) {
                const address = new google.maps.InfoWindow({
                    content: property.address,
                });
            }

            let infowindow = new google.maps.InfoWindow({
                content: `<h3 ${font}>${property.name_store}</h3><p ${font}>${property.address}</p><p><a href="https://www.google.co.th/maps?z=12&t=m&q=loc:${property.latitude}+${property.longitude}" target="_blank" ${bt}>ดูแผนที่</a></p>`,
            });

            //click Zoom
            marker.addListener("click", () => {
                map.setZoom(16);
                map.setCenter(marker.getPosition());
                infowindow.open(map, marker);
            });

            infowindows.push(infowindow);
            markers.push(marker);
        }

        /*---------------json----------------*/

        async function getData() {
            try {
                const response = await fetch('/api/maps.json');
                const json = await response.json();
                const maps = json.maps;
                const name_store = [];

                //Loop addMarker All
                maps.forEach((map, i) => {
                    addMarker(map);
                    name_store[i] = map.name_store;
                });

                //Autocomplete         
                $("#searchInput").autocomplete({
                    source: name_store
                });

                //Query for Input data
                function queryMarket() {
                    //close All infowindows
                    maps.forEach((map, i) => {
                        infowindows[i].close();
                    });
                    //filter text search results
                    const query = maps.filter((map) => {
                        return map.name_store.indexOf(input.value) > -1;
                    });
                    //To location search results
                    map.setZoom(15);
                    map.setCenter(new google.maps.LatLng(query[0].latitude, query[0].longitude));
                    infowindows[query[0].id].open(map, markers[query[0].id]);

                    // input.select();
                    // input.focus();
                    console.log(query);
                }
                input.addEventListener('change', queryMarket);

            }
            catch (err) {
                console.log(err.massage);
                alert(err.message);
            }
        }
        getData();

    }
    window.initMap = initMap;


    /*----------Scroll Header--------------*/

    const header = document.querySelector('.navbar');
    function scrollHeader(e) {
        if (window.scrollY < 100) header.classList.remove('fixed');
        else header.classList.add('fixed');
    }
    window.addEventListener('scroll', scrollHeader);


    /*----------Button Toggle Content------------*/

    const btToggle = document.querySelector('.bt-lean');
    let btToggleArrow = document.querySelector('.bt-lean span');
    const hideContent = document.querySelector('.hide-content');
    let contentHeight = hideContent.offsetHeight;
    hideContent.style.height = '0px';

    function setHeight(height, arrow) {
        hideContent.style.height = height + 'px';
        btToggleArrow.innerHTML = arrow;
    }
    function toggleContent(event) {
        hideContent.style.height == '0px' ? setHeight(contentHeight, '&#9662') : setHeight(0, '&#9652');
    }
    btToggle.addEventListener('click', toggleContent);

    /*------------------API profile----------------------*/

    const blockDoctor = document.querySelector('#block-doctor .slide');
    async function pharmacist() {
        try {
            const response = await fetch('/api/pharmacist.json');
            const json = await response.json();
            const profiles = await json.profile;

            profiles.forEach((profile) => {
                const divElem = document.createElement('div');
                const blElem = document.createElement('div');
                blElem.classList.add('bl');
                const aElem = document.createElement('a');
                aElem.classList.add('iframe-lightbox-link');
                aElem.setAttribute('href', `https://www.youtube.com/embed/${profile.url_vdo}?autoplay=0`);
                aElem.setAttribute('data-padding-bottom', '56.25%');

                const imgElem = document.createElement('img');
                imgElem.src = profile.imgProfile;
                imgElem.setAttribute('alt', profile.name);
                const iElem = document.createElement('i');
                iElem.classList.add('i-play');

                const profileElem = document.createElement('p');
                profileElem.classList.add('profile');
                profileElem.innerHTML = `<b>เภสัชกร</b> ${profile.name} <br /> <b>ประจำร้านยา</b> ${profile.store} <br /> <b>เภสัช CMEd รุ่น</b> ${profile.level}`;

                aElem.prepend(imgElem, iElem);
                blElem.prepend(aElem);
                divElem.append(blElem, profileElem);
                blockDoctor.appendChild(divElem);
            });

            $('#block-doctor .slide').slick({
                dots: true,
                adaptiveHeight: true,
                slidesToShow: 3,
                slidesToScroll: 3,
                responsive: [
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });

            /*------------click vdo popup------------------*/

            [].forEach.call(document.getElementsByClassName("iframe-lightbox-link"), function (el) {
                el.lightbox = new IframeLightbox(el);
              });

        }
        catch (error) {
            console.log(error.massage);
        }
    }

    pharmacist();



})();