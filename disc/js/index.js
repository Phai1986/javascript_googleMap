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


const header = document.querySelector('.navbar');
function scrollHeader(e) {
    if (window.scrollY < 100) {
        header.classList.remove('fixed');
    } else {
        header.classList.add('fixed');
    }
}
window.addEventListener('scroll', scrollHeader);
