

 // Submit form data to the server
 const form = document.getElementById('employee-contact-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = form.elements.name.value;
  const address = form.elements.address.value;
  const email = form.elements.email.value;
  const phone = form.elements.phone.value;
  const jobtitle = form.elements.jobtitle.value;
  const pname = form.elements.pname.value;
  const pnumber = form.elements.pnumber.value;
  const prelation = form.elements.prelation.value;
  const sname = form.elements.sname.value;
  const snumber = form.elements.snumber.value;
  const srelation = form.elements.srelation.value;
  const requestData = {
    name,
    address,
    email,
    phone,
    jobtitle,
    pname,
    pnumber,
    prelation,
    sname,
    snumber,
    srelation
  };
  console.log(requestData);
  fetch('/employee', {
    method: 'POST',
    body: JSON.stringify(requestData),
	headers: {
    'Content-Type': 'application/json'
  }
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    form.reset();
	formshow.style.display="none";
		addnewemployeebutton.style.display="block";
		window.location.reload();
  })
  .catch(error => {
    console.log(error);
    alert('An error occurred while submitting the form');
  });
});




const tableBody = document.querySelector("#employee-table-body");
const paginationContainer = document.querySelector("#pagination-container");

// const currentPageLabel = document.querySelector("#current-page");
// const totalPagesLabel = document.querySelector("#total-pages");

let currentPage = 1;
let totalPages = 1;

const fetchEmployees = (pageNumber) => {
    fetch(`http://localhost:3000/employees/${pageNumber}`)
        .then(response => response.json())
        .then(data => {
            renderTableData(data.data);
            currentPage = data.currentPage;
            totalPages = data.totalPages;
            renderPagination();
        })
        .catch(error => {
            console.log(error);
        });
};

const renderTableData = (employees) => {
    let tableHtml = "";
    employees.forEach(employee => {
        tableHtml += `
            <tr>
                <td>${employee.eid}</td>
        <td>${employee.name}</td>
        <td>${employee.address}</td>
        <td>${employee.phone}</td>
        <td>${employee.jobtitle}</td>
        <td>${employee.email}</td>
        <td>${employee.pname}</td>
        <td>${employee.pnumber}</td>
        <td>${employee.prelation}</td>
        <td>${employee.sname}</td>
        <td>${employee.snumber}</td>
        <td>${employee.srelation}</td>
        <td><button onclick="updatefunction(event)" class="update-button" data='${JSON.stringify(employee)}'>Update</button><button onclick="deletefunction(event)" class="delete-button" data='${JSON.stringify(employee)}'>Delete</button></td>
            </tr>
			
        `;
		// console.log(employees)
    });
    tableBody.innerHTML = tableHtml;
};

const renderPagination = () => {
    let paginationHtml = "";

    if (totalPages > 1) {
        paginationHtml += '<div id="pagination-container">';
        paginationHtml += `<button class="prev-page-button" ${currentPage === 1 ? "disabled" : ""}>Prev</button>`;
        paginationHtml += `<span>Page <span id="current-page">${currentPage}</span> of <span id="total-pages">${totalPages}</span></span>`;
        paginationHtml += `<button class="next-page-button" ${currentPage === totalPages ? "disabled" : ""}>Next</button>`;
        paginationHtml += '</div>';

        paginationContainer.innerHTML = paginationHtml;

        const prevPageButton = document.querySelector(".prev-page-button");
        const nextPageButton = document.querySelector(".next-page-button");

        if (prevPageButton && nextPageButton) {
            prevPageButton.addEventListener("click", () => {
                if (currentPage > 1) {
                    fetchEmployees(currentPage - 1);
                }
            });

            nextPageButton.addEventListener("click", () => {
                if (currentPage < totalPages) {
                    fetchEmployees(currentPage + 1);
                }
            });
        }
    } else {
        paginationContainer.innerHTML = "";
    }
};





//this is going to be insane
// Initial fetch of employees
fetchEmployees(currentPage);
   

// showing form on pressing button
const formshow=document.getElementById("formouter");

	const addnewemployeebutton=document.getElementById('showform')
	addnewemployeebutton.addEventListener('click',()=>{
		console.log("clicked")
		formshow.style.display="block";
		addnewemployeebutton.style.display="none";
		updateformouter.style.display="none";
	})

	const closebutton1=document.getElementById('closebtn1');
	closebutton1.addEventListener('click',()=>{
		console.log("clicked")
		formshow.style.display="none";
		addnewemployeebutton.style.display="block";
	})
  
//deleting employee data
function deletefunction(event) {
  const employee = JSON.parse(event.target.getAttribute("data"));
  console.log('Employee data:', employee.eid);

  let data = employee;
  fetch('/employee/delete', {
    method: 'DELETE',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
	window.location.reload();
  })
  .catch(error => {
    console.log(error);
    alert('An error occurred while sending the request');
  });
}
//getting update data for specific person to start with
const updateform=document.getElementById('updateform');
const updateformouter=document.getElementById('updateformouter');
function updatefunction(event) {
  const employee = JSON.parse(event.target.getAttribute('data'));
  
  console.log('Employee data:', employee.name);
  //displaying form on clicking update with prefilled values
  updateformouter.style.display="block";
  formshow.style.display="none";
  addnewemployeebutton.style.display="block";
updateform.name.value=employee.name;
updateform.name.disabled=true;
updateform.jobtitle.value=employee.jobtitle;
updateform.address.value=employee.address;
updateform.phone.value=employee.phone;
updateform.email.value=employee.email;
updateform.email.disabled=true;
updateform.pname.value=employee.pname;
updateform.pnumber.value=employee.pnumber;
updateform.prelation.value=employee.prelation;
updateform.sname.value=employee.sname;
updateform.snumber.value=employee.snumber;
updateform.srelation.value=employee.srelation;

}
//submitting updated form
updateform.addEventListener('submit',(event)=>{
	event.preventDefault();
  const name = updateform.elements.name.value;
  const address = updateform.elements.address.value;
  const email = updateform.elements.email.value;
  const phone = updateform.elements.phone.value;
  const jobtitle = updateform.elements.jobtitle.value;
  const pname = updateform.elements.pname.value;
  const pnumber = updateform.elements.pnumber.value;
  const prelation = updateform.elements.prelation.value;
  const sname = updateform.elements.sname.value;
  const snumber = updateform.elements.snumber.value;
  const srelation = updateform.elements.srelation.value;
  const requestData = {
    name,
    address,
    email,
    phone,
    jobtitle,
    pname,
    pnumber,
    prelation,
    sname,
    snumber,
    srelation
  };

//patch api  
  fetch('/employee/update', {
    method: 'PATCH',
    body: JSON.stringify(requestData),
	headers: {
    'Content-Type': 'application/json'
  }
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    updateform.reset();
	updateformouter.style.display="none";
		fetchEmployees(currentPage);
  })
  .catch(error => {
    console.log(error);
    alert('An error occurred while submitting the form');
  });

})
	