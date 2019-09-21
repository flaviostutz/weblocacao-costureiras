function getStoreID(success, error) {
    console.log('getStoreID()')
    fetch('/diary/test')
    .then(response => response.text())
    .then(data => {
        reg = /\$\(\"#idStoreSelected\"\).val\(([0-9]+)\)/
        rg = data.match(reg)
        if (rg.length == 2) {
            idStore = parseInt(rg[1], 10);
            success(idStore)
        } else {
            error("couldn't find store id")
        }
    })
    .catch(err => {
        error(err)
    })
}

function fetchProvasList(idStore, dateFrom, dateTo, success, error) {
    //json
    d1 = moment(dateFrom).format("YYYY-MM-DD")
    d2 = moment(dateTo).format("YYYY-MM-DD")
    console.log('fetchProvasList() idStore=' + idStore + 'd1=' + d1 + '; d2=' + d2)
    fetch('/diary/gettestseventsrange?idStore='+ idStore +'&idType=0&start='+d1+'&end='+d2+'&_=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            console.log(data)
            success(data)
        })
        .catch(err => {
            error(err)
        })
}

function fetchContratosAtivosList(idStore, success, error) {
    //json
    console.log('fetchContratosAtivosList() idStore=' + idStore)
    fetch('/order/getajaxdata?Id=&Name=&CPF=&EventDate=&TestDate=&RemoveDate=&idStore='+ idStore +'&OrderDate=&sEcho=4&iColumns=9&sColumns=Id%2CData%2CName%2CCPF%2CRemoveDate%2CEventDate%2CTestDate%2CPrice%2C&iDisplayStart=0&iDisplayLength=500&mDataProp_0=0&bSortable_0=true&mDataProp_1=1&bSortable_1=true&mDataProp_2=2&bSortable_2=true&mDataProp_3=3&bSortable_3=true&mDataProp_4=4&bSortable_4=true&mDataProp_5=5&bSortable_5=true&mDataProp_6=6&bSortable_6=true&mDataProp_7=7&bSortable_7=true&mDataProp_8=0&bSortable_8=true&iSortCol_0=4&sSortDir_0=desc&iSortingCols=1')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            success(data)
        })
        .catch(err => {
            error(err)
        })
}

function fetchContratoDetails(idContrato, success, error) {
    console.log('fetchContratoDetails() idContrato=' + idContrato)
    //html
    //https://www.weblocacao.com.br/order/edit/182250

    //contract
    //name="CustomerName" value="FLAVIA TESTE"
    //<input name="EventDate" value="27/10/2019"

    //list all items: //id="divItemProductRow606003"
    //<input value="17/10/2019 09:00" class="form-control  TestDate" name="OrderItems[602304].TestDate"
    //name="OrderItems[602304].RemoveDate" value="25/10/2019"
    //name="OrderItems[602304].RemovedDate"
    //name="OrderItems[606002].Notes" id="Notes" placeholder="Informações importantes sobre o item ">#toninha</textarea>
}

function fetchAllContratos(cids, contratos, success, error) {
    console.log('fetchAllContratos')
    kv = cids.next()
    if(!kv.done) {
        cid = kv.value
        console.log("contratoId=" + cid)
        fetchContratoDetails(cid, 
            function(contrato) {
                contratos.push(contrato)
                fetchAllContratos(cids, contratos, success, error)
            }, function(err) {
                error(err)
            }
        )
    } else {
        success(contratos)
    }
}

function fetchContratosWithEventsInPeriod(idStore, dateFrom, dateTo, success, error) {
    var contratoIds = new Map();

    //get contratos with retiradas ou eventos in period
    fetchContratosAtivosList(idStore, 
        function(contratosList) {
            for(var i=0; i<contratosList.aaData.length; i++) {
                elem = contratosList.aaData[i]
                console.log("CONTRATO " + elem)
                contratoId = elem[0]
                nome = elem[2];
                eventoDate = moment(elem[4], "DD/MM/YYYY");
                provaDate = moment(elem[5], "DD/MM/YYYY");
                retiradaDate = moment(elem[6], "DD/MM/YYYY");

                //verify if this contract has events inside desired dates
                if(eventoDate.isSameOrAfter(dateFrom) && eventoDate.isSameOrBefore(dateTo)) {
                    console.log("CONTRATO INSIDE TIME " + contratoId)
                    contratoIds.set(contratoId, 1)
                }
                if(provaDate.isSameOrAfter(dateFrom) && provaDate.isSameOrBefore(dateTo)) {
                    console.log("CONTRATO INSIDE TIME " + contratoId)
                    contratoIds.set(contratoId, 1)
                }
                if(retiradaDate.isSameOrAfter(dateFrom) && retiradaDate.isSameOrBefore(dateTo)) {
                    console.log("CONTRATO INSIDE TIME " + contratoId)
                    contratoIds.set(contratoId, 1)
                }
            }

            //get provas in period and extract contratos
            fetchProvasList(idStore, dateFrom, dateTo, 
                function(provasList) {
                    for(var i=0; i<provasList.length; i++) {
                        elem = provasList[i]
                        // console.log("PROVA " + elem.id)
                        contratoIds.set(elem.id+"", 1)
                    }

                    //fetch contrato details
                    contratos = []
                    console.log("CONTRATOS IDS")
                    console.log(contratoIds)
                    fetchAllContratos(contratoIds.keys(), contratos, function(contratos) {
                        success(contratos)
                    }, function(err) {
                        console.error(err)
                        error(err)
                    })
                }
            )

        }, function(err) {
            console.error(err)
            error(err)
        })
}
