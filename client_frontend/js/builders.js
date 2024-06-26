export class ElementBuilder {
    constructor(tag) {
        this.element = document.createElement(tag);
    }

    id(id) {
        this.element.id = id;
        return this;
    }

    class(clazz) {
        this.element.classList.add(clazz);
        return this;
    }

    text(content) {
        this.element.textContent = content;
        return this;
    }

    with(name, value) {
        this.element.setAttribute(name, value);
        return this;
    }
    href(url) {
        this.element.href = url;
        return this;
    }

    listener(name, listener) {
        this.element.addEventListener(name, listener);
        return this;
    }

    append(child) {
        child.appendTo(this.element);
        return this;
    }

    appendTo(parent) {
        parent.append(this.element);
        return this.element;
    }

    insertBefore(parent, sibling) {
        parent.insertBefore(this.element, sibling);
        return this.element;
    }
}

export class ParentChildBuilder extends ElementBuilder {
    constructor(parentTag, childTag) {
        super(parentTag);
        this.childTag = childTag;
    }

    append(text) {
        const childCreator = new ElementBuilder(this.childTag).text(text);
        if (this.childClazz) {
            childCreator.class(this.childClazz);
        }

        super.append(childCreator);
    }

    childClass(childClazz) {
        this.childClazz = childClazz;
        return this;
    }

    items() {
        if (arguments.length === 1 && Array.isArray(arguments[0])) {
            arguments[0].forEach((item) => this.append(item));
        } else {
            for (var i = 0; i < arguments.length; i++) {
                this.append(arguments[i]);
            }
        }

        return this;
    }
}

export function addChartForCryptoBox(chartName, date, price) {

    if (!Array.isArray(date) || !Array.isArray(price) || date.length === 0 || price.length === 0) {
        // console.error("Date or price array is not defined or empty: " + chartName);
        return;
    }

    const xValues = date;
    const yValues = price;
    var color;

    //if price at the start of the array is lower at the end of the array chart is red else green
    if (yValues[0] < yValues[(yValues.length) - 1]) {
        color = "rgb(67,150,74)"
    } else {
        color = "rgb(229,1,35)"
    }

    new Chart(document.getElementById(chartName).getContext('2d'), {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: color,
                borderColor: color,
                data: yValues,
                pointRadius: 2
            }]
        },
        options: {
            legend: {display: false},
            scales: {
                xAxes: [{
                    gridLines: {display: false},
                    ticks: {display: false}
                }],
                yAxes: [{
                    ticks: {display: false},
                    gridLines: {display: false}
                }]
            },
            layout: {
                padding: {
                    left: 8,
                    right: 20,
                    bottom: 20,
                    top: 20
                }
            }
        }
    });
}

export function setUserNameAndToggleLoginButton(){
    const logButton = document.querySelector('.loginButton');
    const userName = document.querySelector('.userName')
    fetch('/user/status', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }

    })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                userName.style.display = "none";
                logButton.textContent = "Login"
                logButton.addEventListener('click', ()=>{
                    location.href = 'login.html';
                })
            }
            return response.json()
        })
        .then(data => {
            userName.style.display = "flex";
            userName.textContent = data.name;
            logButton.textContent = "Logout"
            logButton.addEventListener('click', ()=>{
                if (logButton.textContent === "Logout") {
                    eraseCookie('token');
                    logButton.textContent = "Login";
                }

            })

            sessionStorage.setItem('userArray', data.assets)

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

