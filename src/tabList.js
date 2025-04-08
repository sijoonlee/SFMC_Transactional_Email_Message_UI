let defintionList = null;
let searchKeyword = null;

/* tab list */
const tablistElm = document.getElementById("tab-list");

async function showTabList() {
    if (clientId == null || clientSecret == null) {
        alert('Use credential menu first');
        return;
    }

    tablistElm.style.display = "block";
    tabCredentialElm.style.display = "none";
    tabCreateElm.style.display = "none";

    const inputValue = searchKeyword == null || searchKeyword.trim() === ''
        ? ''
        : searchKeyword;

    if (defintionList == null) {
        tablistElm.innerHTML = `
            <div class="grid grid-cols-2 gap-1">
                <input class="col-span-2 text-black-100 rounded-md bg-lime-50 shadow-blue-300/50 shadow-lg p-3" placeholder="please type keyword to search definition key/name" value="${inputValue}" oninput="updateSearchKeyword(this.value)">
                <button class="col-span-2 text-neutral-100 rounded-md bg-blue-500 shadow-blue-300/50 shadow-lg p-3" onclick="fetchList()">fetch data</button>
            </div>
        `;
    } else {
        drawList();
    }
}


async function fetchList() {
    tablistElm.innerHTML = '';

    showMessage();
    const result = await getList(searchKeyword);
    closeMessage();

    if (result.ok) {
        defintionList = result.body;
    } else {
        alert('Failed to fetch');
        console.log(result.body);
        defintionList = null;
    }

    showTabList();
}

function drawList() {
    if (defintionList == null) {
        alert('fetch first');
        return;
    }

    const list = searchKeyword == null
        ? defintionList
        : defintionList.filter(item => item.definitionKey.includes(searchKeyword) || item.name.includes(searchKeyword));

    if (list.length === 0) {
        alert('Nothing found');
        defintionList = null;
        showTabList();
        return;
    }

    const inputValue = searchKeyword == null || searchKeyword.trim() === ''
        ? ''
        : searchKeyword;

    let innerHTML = `
        <div class="grid grid-cols-2 gap-1">
            <button class="col-span-2 text-neutral-100 rounded-md bg-blue-500 shadow-blue-300/50 shadow-lg p-3" onclick="fetchList()">re-fetch data</button>
            <input class="col-span-2 text-black-100 rounded-md bg-lime-50 shadow-blue-300/50 shadow-lg p-3" placeholder="please type keyword to search definition key/name" value="${inputValue}" oninput="updateSearchKeyword(this.value)">
            <button class="col-span-2 text-neutral-100 rounded-md bg-blue-500 shadow-blue-300/50 shadow-lg p-3" onclick="drawList()">show data</button>
        </div>
        <div class="grid grid-cols-6 gap-1">
    `;

    innerHTML +=  list.map((item) => `
        <label class="col-span-2 bg-emerald-50">name</label><input id="${item.definitionId}-name" class="col-span-4 bg-lime-50" onchange="changeColor('${item.definitionId}', 'name', '${item.definitionId}-name')" value="${item.name}">
        <label class="col-span-2 bg-emerald-50">definitionKey</label><input id="${item.definitionId}-definitionKey" class="col-span-4 bg-lime-50" value="${item.definitionKey}" readonly>
        <label class="col-span-2 bg-emerald-50">definitionId</label><input id="${item.definitionId}-definitionId" class="col-span-4 bg-lime-50" value="${item.definitionId}" readonly>
        <label class="col-span-2 bg-emerald-50">status</label><input class="col-span-4 bg-lime-50" value="${item.status}" readonly>
        <label class="col-span-2 bg-emerald-50">description</label><input class="col-span-4 bg-lime-50" value="${item.description}" readonly>
        <label class="col-span-2 bg-emerald-50">createdDate</label><input class="col-span-4 bg-lime-50" value="${item.createdDate}" readonly>
        <label class="col-span-2 bg-emerald-50">modifiedDate</label><input class="col-span-4 bg-lime-50" value="${item.modifiedDate}" readonly>
        <label class="col-span-2 bg-emerald-50">customerKey</label><input id="${item.definitionId}-customerKey" class="col-span-4 bg-lime-50" value="${item.content?.customerKey ?? 'N/A'}">
        <label class="col-span-2 bg-emerald-50">subscriptions.dataExtension</label><input id="${item.definitionId}-dataExtension" class="col-span-4 bg-lime-50" value="${item.subscriptions?.dataExtension ?? 'N/A'}">
        <label class="col-span-2 bg-emerald-50">subscriptions.list</label><input class="col-span-4 bg-lime-50" value="${item.subscriptions?.list ?? 'N/A'}" readonly>
        <label class="col-span-2 bg-emerald-50">subscriptions.autoAddSubscriber</label><input type="checkbox" id="${item.definitionId}-autoAddSubscriber" class="col-span-4 bg-lime-50" ${item.subscriptions?.autoAddSubscriber === true ? 'checked' : ''}>
        <label class="col-span-2 bg-emerald-50">subscriptions.updateSubscriber</label><input type="checkbox" id="${item.definitionId}-updateSubscriber" class="col-span-4 bg-lime-50" ${item.subscriptions?.updateSubscriber === true ? 'checked' : ''}>
        ${item.isDeleted === true
            ? `<button class="col-span-6 text-black-50 rounded-md bg-red-100 p-1" onclick="recoverRecord('${item.definitionId}')">recover</button>`
            : `<button class="col-span-3 text-black-50 rounded-md bg-blue-50 p-1" onclick="updateRecord('${item.definitionId}')">update</button>
                <button class="col-span-3 text-black-50 rounded-md bg-red-100 p-1" onclick="deleteRecord('${item.definitionId}')">delete</button>`
        }
        <div class="col-span-6 p-3"></div>
    `).join('');

    innerHTML += '</div>';
    tablistElm.innerHTML = innerHTML;
}

function changeColor(definitionId, fieldName, elementId) {
    const found = defintionList.find(def => def.definitionId === definitionId);
    if (found == null) {
        console.log('definitionId not found', definitionId);
        return;
    }

    const element = document.getElementById(elementId);

    if (element == null) {
        return;
    }
    if (fieldName == 'name') {
        if (found.name !== element.value) {
            element.classList.remove('bg-lime-50');
            element.classList.add('bg-red-100');
        } else {
            element.classList.remove('bg-red-100');
            element.classList.add('bg-lime-50');
        }
    }
}

function getUpdatePayload(definitionId) {
    const found = defintionList.find(def => def.definitionId === definitionId);
    if (found == null) {
        console.log('definitionId not found', definitionId);
        return;
    }

    // {
    //     'name': definition_name,
    //     'description': definition_desc,
    //     'classification': send_classification,
    //     'status': 'Active',
    //     'content': {
    //         'customerKey': template,
    //     },
    //     'subscriptions': {
    //         'list': all_subscribers_list,
    //         'dataExtension': table,
    //         'autoAddSubscriber': send_adds_subscriber,
    //         'updateSubscriber': send_updates_subscriber,
    //     }
    // }

    const name = document.getElementById(`${definitionId}-name`).value;
    const customerKey = document.getElementById(`${definitionId}-customerKey`).value;
    const dataExtension = document.getElementById(`${definitionId}-dataExtension`).value;
    const autoAddSubscriber = document.getElementById(`${definitionId}-autoAddSubscriber`).checked;
    const updateSubscriber = document.getElementById(`${definitionId}-updateSubscriber`).checked;

    const changes = []

    if (found.name !== name) {
        changes.push({ fieldName: 'name', old: found.name, new: name })
    }
    if (found.content?.customerKey !== customerKey) {
        changes.push({ fieldName: 'customerKey', old: found.content?.customerKey, new: customerKey })
    }
    if (found.subscriptions?.dataExtension !== dataExtension) {
        changes.push({ fieldName: 'dataExtension', old: found.subscriptions?.dataExtension, new: dataExtension })
    }
    if (found.subscriptions?.autoAddSubscriber !== autoAddSubscriber) {
        changes.push({ fieldName: 'autoAddSubscriber', old: found.subscriptions?.autoAddSubscriber, new: autoAddSubscriber })
    }
    if (found.subscriptions?.updateSubscriber !== updateSubscriber) {
        changes.push({ fieldName: 'updateSubscriber', old: found.subscriptions?.updateSubscriber, new: updateSubscriber })
    }

    const payload = {
        'name': name,
        'description': found.description,
        'classification': found.classification,
        'status': found.status,
        'content': {
            'customerKey': customerKey,
        },
        'subscriptions': {
            'list': found.subscriptions.list,
            'dataExtension': dataExtension,
            'autoAddSubscriber': autoAddSubscriber,
            'updateSubscriber': updateSubscriber,
        }
    }

    return {
        changes,
        payload,
        definitionKey: found.definitionKey,
    }
}

async function updateRecord(definitionId) {
    console.log("updateRecord", definitionId);

    const { changes, payload, definitionKey } = getUpdatePayload(definitionId);
    if (changes.length === 0) {
        const isYes = await swal({
            dangerMode: true,
            text: 'Nothing to update, do you want to refresh?',
            buttons: true,
        });
        if (isYes === true) {
            console.log(payload);
        }
        return;
    }

    const text = changes.map(change => `[✗] ${change.fieldName}: ${change.old}\n[✔︎] ${change.fieldName}: ${change.new}`).join('\n\n');

    const isYes = await swal({
        dangerMode: true,
        text,
        buttons: true,
        className: 'swal-wide',
    });

    if (isYes) {
        console.log(payload);
        showMessage();
        const result = await updateRecordApi(definitionKey, payload);
        closeMessage();
        if (result.ok === true) {
            const index = defintionList.findIndex(def => def.definitionId === definitionId);
            if (index < 0) {
                alert("Please report bug");
                return;
            }
            defintionList[index] = { ...defintionList[index], ...payload };
            for (const change of changes) {
                if (change.fieldName === 'name') {
                    defintionList[index].name = change.new;
                } else if (change.fieldName === 'customerKey') {
                    defintionList[index].content.customerKey = change.new;
                } else if (change.fieldName === 'dataExtension') {
                    defintionList[index].subscriptions.dataExtension = change.new;
                } else if (change.fieldName === 'autoAddSubscriber') {
                    defintionList[index].subscriptions.autoAddSubscriber = change.new;
                } else if (change.fieldName === 'updateSubscriber') {
                    defintionList[index].subscriptions.updateSubscriber = change.new;
                } else {
                    alert('please report bug - 1');
                }
            }
            console.log(defintionList[index])
        } else {
            alert("Failed to update");
        }
    } else {
        console.log('No');
    }
}

function updateSearchKeyword(value) {
    searchKeyword = value;
}


async function recoverRecord(definitionId) {
    console.log("recoverRecord", definitionId);

    if (definitionId == null) {
        console.log('defintionId not passed');
        return;
    }

    const found = defintionList.find(def => def.definitionId === definitionId);
    if (found == null) {
        console.log('definitionId not found', definitionId);
        return;
    }

    console.log("found.definitionKey", found.definitionKey);

    const clone = { ...found };
    delete clone.isDeleted;
    delete clone.requestId;
    delete clone.definitionId;
    delete clone.createdDate;
    delete clone.modifiedDate;
    delete clone.journey;
    delete clone.options;

    showMessage();

    const result = await createRecordApi({ ...clone});

    closeMessage();

    if (result.ok === true) {
        delete found.isDeleted;
        await fetchList();
    } else {
        alert('Failed to recover')
        console.log(result.body);
    }

}

async function deleteRecord(definitionId) {
    console.log("deleteRecord", definitionId);

    if (definitionId == null) {
        console.log('defintionId not passed');
        return;
    }

    const found = defintionList.find(def => def.definitionId === definitionId);
    if (found == null) {
        console.log('definitionId not found', definitionId);
        return;
    }

    console.log("found.definitionKey", found.definitionKey);

    const isYes = await swal({
        dangerMode: true,
        text: 'Are you sure to delete?',
        buttons: true,
        className: 'swal-wide',
    });

    if (isYes) {
        showMessage();
        const result = await deleteRecordApi(found.definitionKey);
        closeMessage();

        if (result.ok === true) {
            found.isDeleted = true;
            drawList();
        } else {
            alert('Failed to delete');
            console.log(result.body);
        }
    }
}