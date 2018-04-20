const loginPage = `
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
const loggedInPage = (key, number) => `
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
                Number of transactions
            </h1>
            <p>${number}</p>
        </div>

    </section>   
`

const renderLoggedInPage = (secretSeed) => {
    const publicKey = keypairFromSecret(secretSeed).publicKey()
    const noTx = server.transactions().forAccount(publicKey).call().then(page => 
        document.getElementById('app').innerHTML = loggedInPage(publicKey, page.records.length))
}

document.getElementById('app').innerHTML = loginPage
const stellar = StellarSdk
const server = new stellar.Server('https://horizon-testnet.stellar.org')

const login = () => {
    const secretSeed = document.getElementById('seed').value
    renderLoggedInPage(secretSeed)
    document.getElementById('signout').innerHTML = `<button onclick="logout()" class="button">Sign out</button>`
}

const logout = () => {
    document.getElementById('app').innerHTML = loginPage
    document.getElementById('signout').innerHTML = ''
}

const keypairFromSecret = (secret) => {
    return stellar.Keypair.fromSecret(secret)
}