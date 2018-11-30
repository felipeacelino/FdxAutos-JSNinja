(function(win, doc, $) {
    'use strict';

    var app = (function() {

        var urlServer = 'http://localhost:3000/car';

        return {
            init: function init() {
                app.companyInfo();
                app.initEvents();
            },

            initEvents: function initEvents() {
                app.getCars();
                $('[data-js="form"]').on('submit', app.handleSubmit);
            },

            ajax: function ajax(url, method, data, callback) {
                var ajax = new XMLHttpRequest();
                ajax.open(method, url);
                ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                ajax.send(data);
                ajax.addEventListener('readystatechange', () => {
                    if (ajax.readyState === 4 && ajax.status === 200) {
                        callback(ajax.responseText);
                    }
                }, false);
            },
 
            companyInfo: function companyInfo() {
                var $companyName = $('[data-js="company-name"]');
                var $companyPhone = $('[data-js="company-phone"]');

                app.ajax('company.json', 'GET', '', (resp) => {
                    var data = JSON.parse(resp);
                    $companyName.text(data.name);
                    $companyPhone.text(data.phone);
                });
            },

            handleSubmit: function handleSubmit(e) {
                e.preventDefault();
    
                var data = 'image='+$('[data-js="image"]').val()+'&brandModel='+$('[data-js="model"]').val()+'&year='+$('[data-js="year"]').val()+'&plate='+$('[data-js="plate"]').val()+'&color='+$('[data-js="color"]').val();

                app.ajax(urlServer, 'POST', data, (resp) => {
                    var response = JSON.parse(resp);
                    if (response.message === 'success') {
                        app.getCars();
                    }
                });
            },

            getCars: function getCars() {
                app.ajax(urlServer, 'GET', '', (resp) => {
                    var cars = JSON.parse(resp);
                    app.listCars(cars);
                    if (cars.length > 0) {
                        app.listCars(cars);
                    } else {
                        $('[data-js="table-list"]').get().innerHTML = '';
                    }
                });
            },

            listCars: function listCars(cars) {
                var $tableList = $('[data-js="table-list"]').get();
                $tableList.innerHTML = '';
                Array.prototype.forEach.call(cars, (car) => {
                    $tableList.appendChild(app.createNewCar(car));
                });
            },

            createNewCar: function createNewCar(carObj) {
                var $fragment = doc.createDocumentFragment();
                var $tr = doc.createElement('tr');
                var $tdImage = doc.createElement('td');
                var $tdModel = doc.createElement('td');
                var $tdYear = doc.createElement('td');
                var $tdPlate = doc.createElement('td');
                var $tdColor = doc.createElement('td');
                var $tdRem = doc.createElement('td');
                var $img = doc.createElement('img');
                var $remBtn = doc.createElement('button');

                $img.src = carObj.image;
                $tdModel.textContent = carObj.brandModel;
                $tdYear.textContent = carObj.year;
                $tdPlate.textContent = carObj.plate;
                $tdColor.textContent = carObj.color;
                $remBtn.classList += 'btn btn-danger';
                $remBtn.textContent = 'Remover';
                $remBtn.setAttribute('data-plate', carObj.plate);
                $remBtn.addEventListener('click', app.removeCar, false);

                $tdImage.appendChild($img);
                $tr.appendChild($tdImage);
                $tr.appendChild($tdModel);
                $tr.appendChild($tdYear);
                $tr.appendChild($tdPlate);
                $tr.appendChild($tdColor);
                $tdRem.appendChild($remBtn);
                $tr.appendChild($tdRem);
                $fragment.appendChild($tr);
                
                return $fragment.appendChild($tr);
            },

            removeCar: function removeCar(e) {
                e.preventDefault();

                var plateRem = this.getAttribute('data-plate');
                var data = 'plate='+plateRem;

                app.ajax(urlServer, 'DELETE', data, (resp) => {
                    var response = JSON.parse(resp);
                    if (response.message === 'success') {
                        app.getCars();
                    }
                });
            }
        };
    })();

    app.init();
    
})(window, document, window.DOM);