/**
 * Login page template
 * 
 */
let loginPage = `
    <section class="section">
        <div class="container box">
            <h1 class="title">
                Welcome to light wallet
            </h1>
            <div class="columns">
                <div class="column is-one-third">
                    <div class="field">
                        <label class="label">Name</label>
                        <div class="control">
                            <input id="seed" class="input" type="text" placeholder="Text input">
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <button onclick="login()" class="button">Unlock</button>
                        </div>
                     </div>
                </div>
                <div class="column is-one-third">
                    <h3 class="subtitle">
                        Unlock your account in order to  send lumens...
                    </h3>
                </div>
            </div>

        </div>
    </section>      
`
/**
 * LoggedInPage
 * 
 * @param {any} key 
 * @param {any} number 
 */
let loggedInPage = (key, number) => `
    <section class="section">
        <div class="container box">
            <h1 class="title">
                You have been logged in!
            </h1>
            <h2 class="subtitle">
                Your public key ${key}
            </h2>
        </div>
        <div class="container box">
            <h1 class="title">
                Balance
            </h1>
            <h2 id="balance" class="subtitle">
            </h2>
        </div>
        <div class="container box">
            <h1 class="title">
                Number of transactions
            </h1>
            <p>${number}</p>
        </div>

    </section>   
`
/**
 * Check the balance of account 
 * 
 * @param {any} key 
 */
let getBalance = (key) => {
    server.loadAccount(key).then(acc => {
        acc.balances.forEach( balance => {
            if (balance.asset_type === 'native') {
                document.getElementById('balance').innerHTML = `${balance.balance} XLM`
                console.log(`XLM : ${balance.balance}}`)
            }
        })
    })
}


/**
 * Renders logged in page
 * 
 * @param {any} secretSeed 
 */
let renderLoggedInPage = (secretSeed) => {
    let publicKey = keypairFromSecret(secretSeed).publicKey()
    let noTx = server.transactions().forAccount(publicKey).call().then(page => 
        document.getElementById('app').innerHTML = loggedInPage(publicKey, page.records.length)).then(getBalance(publicKey))
}
/**
 * Login method calls renderLoggedInPage and adds signout button
 * 
 */
let login = () => {
    let secretSeed = document.getElementById('seed').value
    renderLoggedInPage(secretSeed)
    document.getElementById('signout').innerHTML = `<button onclick="logout()" class="button">Sign out</button>`
}

/**
 * Logout method
 * Show initial page
 * 
 */
let logout = () => {
    document.getElementById('app').innerHTML = loginPage
    document.getElementById('signout').innerHTML = ''
}

/**
 * Helper method
 * Generate keypair from secret seed
 * 
 * @param {any} secret 
 * @returns StellarSdk.Keypair
 */
let keypairFromSecret = (secret) => {
    return stellar.Keypair.fromSecret(secret)
}

/** 
 * Basic setup
 * Render login page first and set server url
 * 
*/
document.getElementById('app').innerHTML = loginPage
let stellar = StellarSdk
let server = new stellar.Server('https://horizon-testnet.stellar.org')