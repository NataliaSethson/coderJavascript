document.addEventListener('DOMContentLoaded', () => {

    
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Dettmann',
            precio: 9000,
            imagen: 'https://groove.de/wp-content/uploads/2016/10/Marcel-Dettmann-by-Flavien-Prioreau-851x420.jpg'
        },
        {
            id: 2,
            nombre: 'Hot-Since-82',
            precio: 8000,
            imagen: 'https://ege.electronicgroove.com/wp-content/uploads/2019/09/Hot-since-82-3.jpg'
        },
        {
            id: 3,
            nombre: 'Solomun',
            precio: 12000,
            imagen: 'https://th.bing.com/th/id/OIP.6zveD3yzhEEpwBe_zJ0B3QHaEK?pid=ImgDet&rs=1'
        },
        {
            id: 4,
            nombre: 'Len Faki',
            precio: 7000,
            imagen: 'https://th.bing.com/th/id/OIP.dDc9vwsS29Rh0a_GZr5W8QHaE8?pid=ImgDet&rs=1'
        }

    ];

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;

    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
    
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
        
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.precio}${divisa}`;
        
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = '+';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }


    function anyadirProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador')) 
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
    }

    
    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
            });

            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);

            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
        
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        
        DOMtotal.textContent = calcularTotal();
    }

        function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        
        renderizarCarrito();
        guardarCarritoEnLocalStorage();

    }

    
    function calcularTotal() {
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    

    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
        localStorage.clear();
        swal({
            title: "Estás seguro que lo quieres eliminar?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              swal("Se eliminó correctamente, el carrito se encuentra vacío", {
                icon: "success",
              });
            } else {
              swal("Vuélvelo a intentar");
            }
          });
    }

    function guardarCarritoEnLocalStorage () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage () {
    if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }


    DOMbotonVaciar.addEventListener('click', vaciarCarrito);

    
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});