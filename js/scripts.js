$(document).ready(function () {
    
    const cargoList = [
        {
          id: "CARGO001",
          name: "Строительные материалы",
          status: "В пути",
          origin: "Москва",
          destination: "Казань",
          departureDate: "2024-11-24"
        },
        {
          id: "CARGO002",
          name: "Хрупкий груз",
          status: "Ожидает отправки",
          origin: "Санкт-Петербург",
          destination: "Екатеринбург",
          departureDate: "2024-12-03"
        }
      ];
      
    function loadCargoData() {
        const data = localStorage.getItem('cargoData');
        const savedData = data ? JSON.parse(data) : [];

        return [...cargoList, ...savedData] 
    }

    function saveCargoData(data) {
        localStorage.setItem('cargoData', JSON.stringify(data));
    }

    let cargoData = loadCargoData();

    function getStatusClass(status) {
        switch (status) {
            case "В пути":
                return "table-warning";
            case "Доставлен":
                return "table-success";
            case "Ожидает отправки":
                return "table-danger";
            default:
                return "";
        }
    }

    function renderTable(data) {
        $('#cargoTableBody').empty();
        data.forEach((cargo, index) => {
            const statusClass = getStatusClass(cargo.status);
            const tableRow = `
                <tr class="${statusClass}">
                    <td>${cargo.id}</td>
                    <td>${cargo.name}</td>
                    <td>
                        <select class="form-select status-select" data-index="${index}" data-date="${cargo.departureDate}">
                            <option value="В пути" ${cargo.status === "В пути" ? "selected" : ""}>В пути</option>
                            <option value="Доставлен" ${cargo.status === "Доставлен" ? "selected" : ""}>Доставлен</option>
                            <option value="Ожидает отправки" ${cargo.status === "Ожидает отправки" ? "selected" : ""}>Ожидает отправки</option>
                        </select>
                    </td>
                    <td>${cargo.origin}</td>
                    <td>${cargo.destination}</td>
                    <td>${cargo.departureDate}</td>
                </tr>
            `;
            $('#cargoTableBody').append(tableRow);
        });
    }

    renderTable(cargoData);

    $(document).on('change', '.status-select', function () {
        const index = $(this).data('index'); 
        const newStatus = $(this).val();
        const departureDate = new Date($(this).data('date'));
        const currentDate = new Date();

        if (newStatus === "Доставлен" && departureDate > currentDate) {
            alert("Невозможно установить статус 'Доставлен', так как дата отправления еще не наступила.");
            $(this).val(cargoData[index].status); 
            return;
        }

        cargoData[index].status = newStatus;
        saveCargoData(cargoData);
        renderTable(cargoData);
    });

    $('#addOrderForm').submit(function (event) {
        event.preventDefault();

        const newCargo = {
            id: $('#orderId').val(),
            name: $('#orderName').val(),
            status: $('#orderStatus').val(),
            origin: $('#orderOrigin').val(),
            destination: $('#orderDestination').val(),
            departureDate: $('#orderDate').val()
        };

        cargoData.push(newCargo);
        saveCargoData(cargoData);
        renderTable(cargoData);

        $('#addOrderForm')[0].reset();
        $('#addOrderModal').modal('hide');
    });

    $('#filterStatus, #startDate, #endDate').on('input', function () {
        const statusFilter = $('#filterStatus').val();
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();

        const filteredData = cargoData.filter(cargo => {
            const matchStatus = statusFilter === "" || cargo.status === statusFilter;
            const matchDate =
                (!startDate || new Date(cargo.departureDate) >= new Date(startDate)) &&
                (!endDate || new Date(cargo.departureDate) <= new Date(endDate));
            return matchStatus && matchDate;
        });

        renderTable(filteredData);
    });
});