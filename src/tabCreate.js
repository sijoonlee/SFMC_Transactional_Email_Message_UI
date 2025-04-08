/* tab create */
const tabCreateElm = document.getElementById("tab-create");


const SubscriptionsList = "All Subscribers - 1748"; // this may differ in other setting

tabCreateElm.innerHTML = `
    <div class="grid grid-cols-6 gap-1">
        <label class="col-span-2 bg-emerald-50">name</label><input id="tab-create-name" type="text" class="col-span-4 bg-lime-50" placeholder="Leave blank for auto-generation">
        <label class="col-span-2 bg-emerald-50">definitionKey</label><input id="tab-create-definitionKey" class="col-span-4 bg-lime-50" placeholder="Define send-definition key that you will use in BE service">
        <label class="col-span-2 bg-emerald-50">description</label><input id="tab-create-description" class="col-span-4 bg-lime-50" placeholder="Leave blank for auto-generation">
        <label class="col-span-2 bg-emerald-50">customerKey</label><input id="tab-create-customerKey" class="col-span-4 bg-lime-50" placeholder="Input SFMC email template customer key">
        <label class="col-span-2 bg-emerald-50">subscriptions.dataExtension</label><input id="tab-create-dataExtension" class="col-span-4 bg-lime-50" placeholder="Input SFMC data extension external key">
        <label class="col-span-2 bg-emerald-50">subscriptions.list</label><input class="col-span-4 bg-lime-50" value=${SubscriptionsList} readonly>
        <label class="col-span-2 bg-emerald-50">subscriptions.autoAddSubscriber</label><input type="checkbox" id="tab-create-autoAddSubscriber" class="col-span-4 bg-lime-50">
        <label class="col-span-2 bg-emerald-50">subscriptions.updateSubscriber</label><input type="checkbox" id="tab-create-updateSubscriber" class="col-span-4 bg-lime-50" checked>
        <div class="col-span-6 p-3"></div>
        <button class="col-span-6 text-black-50 rounded-md bg-red-100 p-1" onclick="createRecord()">create</button>
    </div>
`;


async function showTabCreate() {
    if (clientId == null || clientSecret == null) {
        alert('Use credential menu first');
        return;
    }

    tablistElm.style.display = "none";
    tabCredentialElm.style.display = "none";
    tabCreateElm.style.display = "block";
}

function getCreateRecordValues() {
    let name = document.getElementById("tab-create-name").value;
    const definitionKey = document.getElementById("tab-create-definitionKey").value;
    let description = document.getElementById("tab-create-description").value;
    const customerKey = document.getElementById("tab-create-customerKey").value;
    const dataExtension = document.getElementById("tab-create-dataExtension").value;
    const autoAddSubscriber = document.getElementById("tab-create-autoAddSubscriber").checked;
    const updateSubscriber = document.getElementById("tab-create-updateSubscriber").checked;

    let message = ''
    console.log(definitionKey)
    if (definitionKey == null || definitionKey.trim() === '') {
        message += 'definitionKey is required\n';
    }
    if (customerKey == null || customerKey.trim() === '') {
        message += 'customerKey is required\n';
    }
    if (dataExtension == null || dataExtension.trim() === '') {
        message += 'dataExtension is required\n';
    }
    if (typeof autoAddSubscriber !== 'boolean') {
        message += 'autoAddSubscriber should be boolean\n';
    }
    if (typeof updateSubscriber !== "boolean") {
        message += 'updateSubscriber should be boolean\n';
    }

    if (name == null || name.trim() === '') {
        name = `${dataExtension}_${customerKey}-name`;
        document.getElementById("tab-create-name").value = name;
    }

    if (name.length > 64) {
        message += 'name should be string less than 64 letters\n';
    }

    if (description == null || description.trim() === '') {
        description = `Automatically generated - Joins table ${dataExtension} with template ${customerKey}`;
        document.getElementById("tab-create-description").value = description;
    }

    if (message.length > 0) {
        swal({
            icon: 'warning',
            text: message + 'Please fix and try again',
            className: 'swal-wide',
        });
        return null;
    }

    return {
        name,
        definitionKey,
        description,
        customerKey,
        dataExtension,
        autoAddSubscriber,
        updateSubscriber,
    };
}

async function createRecord() {
    const values = getCreateRecordValues();
    if (values == null) {
        return;
    }
    console.log('Create record', values);
    const {
        name,
        definitionKey,
        description,
        customerKey,
        dataExtension,
        autoAddSubscriber,
        updateSubscriber,
    } = values;

    showMessage();
    const result = await createRecordApi({
        'name': name,
        'definitionKey': definitionKey,
        'description': description,
        'classification': 'Default Transactional',
        'status': 'Active',
        'content': {
            'customerKey': customerKey,
        },
        'subscriptions': {
            'list': SubscriptionsList,
            'dataExtension': dataExtension,
            'autoAddSubscriber': autoAddSubscriber,
            'updateSubscriber': updateSubscriber,
        }
    });
    closeMessage();

    if (result.ok === false) {
        alert('Faild to create');
    }
    console.log(result.body);
}