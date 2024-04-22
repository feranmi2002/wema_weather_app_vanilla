const baseUrlNames = 'https://api.currencyapi.com/v3/currencies'
const baseUrlRates = 'https://api.currencyapi.com/v3/latest'
const apiKey = "cur_live_FnMBZKXXpSZ4B0ut0VJdW1MJtbdRdQ2hUCGfbZ57"

const currencyFromInput = document.getElementById("currencyFromInput")
const currencyToInput = document.getElementById("currencyToInput")
const currencySelectFrom = document.getElementById("currencySelectFrom")
const currencySelectTo = document.getElementById("currencySelectTo")
const transactionImg = document.getElementById("transactionImg")
const loader = document.getElementById("loader")
const error = document.getElementById("error")
const errorButton = document.getElementById("errorButton")



let currencyNames = new Map()
let exchangeRates = new Map()


async function fetchCurrencyNames() {
    const optionsNames = {
        method: 'GET',
        headers: {
            apikey: apiKey
        }
    }

    const optionsRates = {
        method: 'GET',
        headers: {
            apikey: apiKey
        }
    }

    try {
        showLoader()
        const currenciesResponse = await fetch(baseUrlNames, optionsNames)
        const currenciesResult = await currenciesResponse.json()

        const exchangeRateResponse = await fetch(baseUrlRates, optionsRates)
        const exchangeRateResults = await exchangeRateResponse.json()

        if (currenciesResponse.ok && exchangeRateResponse.ok) {
            hideLoader()

            //    load currency names
            Object.entries(currenciesResult.data).forEach(items => {
                currencyNames.set(
                    items[1].symbol, items[1].name
                )

                let option1 = document.createElement("option")
                option1.value = items[0]
                option1.innerHTML = `${items[1].name} (${items[0]})`
                currencySelectFrom.append(option1)

                let option2 = document.createElement("option")
                option2.value = items[0]
                option2.innerHTML = `${items[1].name} (${items[0]})`
                currencySelectTo.append(option2)
            })

            // load exchangeRates
            Object.entries(exchangeRateResults.data).forEach(items => {
                exchangeRates.set(
                    items[1].code, items[1].value
                )
            })

            showConverter()
        } else {
            showError()
        }
    } catch (error) {
        showError()
    }
}


function showLoader() {
    loader.style.display = "block"
}

function hideLoader() {
    loader.style.display = "none"
}

function showConverter() {
    currencySelectFrom.style.display = "block"
    currencySelectTo.style.display = "block"
    transactionImg.style.display = "block"
    currencyFromInput.style.display = "block"
    currencyToInput.style.display = "block"
}

function hideConverter() {
    currencySelectFrom.style.display = "none"
    currencySelectTo.style.display = "none"
    transactionImg.style.display = "none"
    currencyFromInput.style.display = "none"
    currencyToInput.style.display = "none"
}

function showError() {
    error.style.display = "block"
    errorButton.style.display = "block"
}

function hideError() {
    error.style.display = "none"
    errorButton.style.display = "none"
}

function onClickErrorButton() {
    hideError()
    fetchCurrencyNames()
}

if (document.readyState !== 'loading') {
    fetchCurrencyNames()
} else {
    document.addEventListener('DOMContentLoaded', fetchCurrencyNames)
}


function fromInput() {
    var inputValue = currencyFromInput.value
    if (isNaN(inputValue)) {
        currencyFromInput.value = 0
        currencyToInput.value = 0
    } else {
        var fromCurrency = currencySelectFrom.value
        var toCurrency = currencySelectTo.value


        var fromConversionRate = exchangeRates.get(fromCurrency)
        var toConversionRate = exchangeRates.get(toCurrency)

        var result = (inputValue / fromConversionRate) * toConversionRate

        currencyToInput.value = parseFloat(result.toFixed(2)).toLocaleString()
    }
}

function toInput() {
    var inputValue = currencyToInput.value
    if (isNaN(inputValue)) {
        currencyFromInput.value = 0
        currencyToInput.value = 0
    } else {
        var fromCurrency = currencySelectFrom.value
        var toCurrency = currencySelectTo.value

        var fromConversionRate = exchangeRates.get(fromCurrency)
        var toConversionRate = exchangeRates.get(toCurrency)

        var result = (inputValue / toConversionRate) * fromConversionRate

        currencyFromInput.value = parseFloat(result.toFixed(2)).toLocaleString()
    }

}

