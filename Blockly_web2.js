let toolBox = document.getElementById("toolBox")
let designArea = document.getElementById("DesignArea")
let styleBox = document.querySelector(".styleBox1")

let buildStyleBox
let currentBtn
let currentParentId = "root"
let tree = {
    "root": {"id": "root", "type": "div", "parentId": null, "children": [], "styles":{}, "props": {}, "text": null}
}
let lastId = 1


// اطلاعات هر المنت و محدودیت هایی که برای ساختنش داریم
let elements = {
    h1:{
        tag: "h1",
        label: "h1 (Main Heading)",
        canHaveChildren: false,
        hasText: true,
        allowedParents: null,
        defaultProps: {},
    },

    h2:{
        tag: "h2",
        label: "h2 (Heading)",
        canHaveChildren: false,
        hasText: true,
        allowedParents: null,
        defaultProps: {}
    },

    h3:{
        tag: "h3",
        label: "h3",
        canHaveChildren: false,
        hasText: true,
        allowedParents: null,
        defaultProps: {}
    },

    h4:{
        tag: "h4",
        label: "h4",
        canHaveChildren: false,
        hasText: true,
        allowedParents: null,
        defaultProps: {}
    },

    h5:{
        tag: "h5",
        label: "h5",
        canHaveChildren: false,
        hasText: true,
        allowedParents: null,
        defaultProps: {}
    },

    h6:{
        tag: "h6",
        label: "h6",
        canHaveChildren: false,
        hasText: true,
        allowedParents: null,
        defaultProps: {}
    },

    p:{
        tag: "p",
        label: "p (paragraph)",
        canHaveChildren: false,
        hasText: true,
        allowedParents: null,
        defaultProps: {}
    },

    a:{
        tag: "a",
        label: "a (Link)",
        canHaveChildren: true,
        hasText: true,
        allowedParents: null,
        defaultProps: {
            href: "#",
            target: "_self"
        },
        allowedChildren: null,
        props: ["href", "target"],
        props: [
            {prop: "href", label: "آدرس لینک", type: "text"},
            {prop: "target", label: "نحوه باز شدن لینک", type: "select"}
        ]
    },

    div: {
        tag: "div",
        label: "div (Box)",
        canHaveChildren: true,
        hasText: true,
        allowedParents: null,
        defaultProps: {},
        allowedChildren: null
    },

    ul: {
        tag: "ul",
        label: "ul (List)",
        canHaveChildren: true,
        hasText: false,
        allowedParents: null,
        defaultProps: {},
        allowedChildren: ["li"]
    },

    ol: {
        tag: "ol",
        label: "ol (Numbered List)",
        canHaveChildren: true,
        hasText: false,
        allowedParents: null,
        defaultProps: {},
        allowedChildren: ["li"]
    },

    li: {
        tag: "li",
        label: "li (List item)",
        canHaveChildren: true,
        hasText: true,
        allowedParents: ["ul", "ol"],
        defaultProps: {},
        allowedChildren: null
    },

    button: {
        tag: "button",
        label: "button",
        canHaveChildren: true,
        hasText: true,
        allowedParents: null,
        defaultProps: {type: "button"},
        allowedChildren: null
    },

    img: {
        tag: "img",
        label: "img",
        canHaveChildren: false,
        hasText: false,
        allowedParents: null,
        defaultProps: {src: "", alt: ""},
        props: [
            {prop: "src", label: "آدرس عکس", type: "text"},
            {prop: "alt", label: "متن جایگزین", type: "text"},
        ]
    }
}


// لیست استایل هایی که کاربر میتونه روی المنت هایی که ساخته اعمال کنه
let styleFields = [

    // همه المنت ها
    {prop: "backgroundColor", label: "رنگ پس زمینه", type: "color"},
    {prop: "padding", label: "فاصله داخلی", type: "number", unit: "px"},
    {prop: "width", label: "عرض", type: "text"},
    {prop: "height", label: "ارتفاع", type: "text"},
    {prop:"top", label: "موقعیت از بالا", type: "text"},
    {prop:"left", label: "موقعیت از چپ", type: "text"},
    {prop:"right", label: "موقعیت از راست", type: "text"},
    {prop:"bottom", label: "موقعیت از پایین", type: "text"},
    {prop: "position", label: "نحوه جایگیری", type: "select", options: ["static", "relative", "absolute", "fixed", "sticky"]},
    {prop: "border", label: "حاشیه", type: "text"},
    {prop: "borderRadius", label: "گردی گوشه ها", type: "text"},
    
    // فقط المنت هایی که متن دارن
    {prop: "color", label: "رنگ نوشته", type: "color", requires: "hasText"},
    {prop: "fontSize", label: "اندازه نوشته", type: "number", unit: "px", requires: "hasText"},

    // فقط المنت هایی که فرزند میپذیرن
    {prop: "display", label: "نحوه نمایش", type: "select", options: ["block", "flex"], requires: "canHaveChildren"},

    // فقط تگ های مشخص شده
    {prop: "objectFit", label: "نحوه جدا شدن عکس", type: "select", options: ["cover", "contain", "fill"], only: ["img"]},
    {prop: "listStyleType", label: "نوع نقطه ها", type: "select", options: ["disc", "circle", "square", "decimal"], only: ["ul", "ol"]},
    

    {prop: "justifyContent", label: "چیدمان افقی", type: "select",options: [
        "flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"
    ],
    requiresDisplay: "flex"},

    {prop: "alignItems", label: "چیدمان عمودی", type: "select",
    options: ["stretch", "flex-start", "center", "flex-end", "baseline"],
    requiresDisplay: "flex"},

    {prop: "gap", label: "فاصله بین فرزندها", type: "number",
    unit: "px", requiresDisplay: "flex"}

]


// گزینه هایی که برای سلکت های مربوط به ویژگی های المنت داریم
let selectFields = {
    target: {
        label: "نحوه باز شدن لینک",
        options: [
            {
                label: "همین تب",
                value: "_self",
                description: "لینک در همین صفحه باز می‌شود."
            },
            {
                label: "تب جدید",
                value: "_blank",
                description: "لینک در یک تب جدید باز می‌شود."
            }
        ],
        defaultValue: "_self"
    }
}


// سلکت و آپشن رو میسازه و وقتی روی دکمه بزنی بهت ارزش آپشن انتخاب شده رو برمیگردونه و باید بری ازش استفاده کنی
let addOptionsForStyles = function(field, id, btn){
    styleBox.innerHTML = ""

    // ساخت سلکت برای انتخاب کردن یکی از گزینه های استایل
    let selectPart = document.createElement("select")

    let changeBtn = document.createElement("button")
    changeBtn.setAttribute("type", "button")
    changeBtn.setAttribute("class", "changeBtn")
    changeBtn.innerHTML = "Change"

    let backBtn = document.createElement("button")
    backBtn.setAttribute("type", "button")
    backBtn.setAttribute("class", "changeBtn")
    backBtn.innerHTML = "Back"


    backBtn.addEventListener("click", () => buildStyleBox(id))

    // اظافه کردن گزینه های استایل به سلکت
    for (let option of field["options"]){

        let optionPart = document.createElement("option")
        optionPart.setAttribute("value", option)
        optionPart.innerHTML = option

        selectPart.appendChild(optionPart)
    }


    // وقتی کاربر روی دکمه چنج(آخرین مرحله) کلیک میکنه
    // ذخیره گزینه انتخاب شده(آپشن انتخاب شده) و نمایش دوباره صفحه
    changeBtn.addEventListener("click", () => {
        tree[id]["styles"][btn.value] = selectPart.value
        render()
        buildStyleBox(id)
    })

    styleBox.appendChild(selectPart)
    styleBox.appendChild(changeBtn)
    styleBox.appendChild(backBtn)
}


// گرفتن فیلد و ساخت دکمه مربوط به هرنوع فیلد
let buildfieldsForStyles = function(field, id){

    // دکمه فیلد با توضیح فارسی جلوش(بعد از کلیک روی دکمه استایل نمایش داده میشه)
    let btn = document.createElement("button")

    btn.setAttribute("type", "button")
    btn.setAttribute("value", field["prop"])
    btn.innerHTML = `${field["prop"]}: ${field["label"]}`

    // اگه نوع فیلد سلکت نبود اینپوت بساز
    if (field["type"] != "select")
    btn.addEventListener("click", ()=> addStyle(field, id))

    // اگه نوع فیلد سلکت بود سلکت و آپشن ها رو بساز
    else{
        btn.addEventListener("click", () => addOptionsForStyles(field, id, btn))
    }

    styleBox.appendChild(btn)
}


// ساخت المنت از روی اطلاعاتی که توی درخت ذخیره شده
let buildEl = function(id){
    let el = document.createElement(tree[id]["type"])

    // اگه المنت متن میگیره یه متن پیش فرض براش بذار
    if (elements[tree[id]["type"]]["hasText"]){
        el.innerHTML = `${tree[id]["type"]} by id: ${id} created.`
    }

    // اگه کاربر برای المنت متن وارد کرده متن پیش فرض رو با اون عوض کن
    if (tree[id]["text"] != null ){
        el.innerHTML = ""
        let textNode = document.createTextNode(tree[id]["text"])
        el.appendChild(textNode)
    }

    // اگه عکس آدرس نداشت یه ظاهر پیش فرض بهش بده که دیده بشه و بشه روش کلیک کرد
    if (tree[id]["type"] == "img" && !tree[id]["props"]["src"]) {
        el.style.width = "150px"
        el.style.height = "100px"
        el.style.backgroundColor = "gray"
    }

    // اعمال استایل هایی که کاربر برای این المنت انتخاب کرده
    for(let prop in tree[id]["styles"]){
        el.style[prop] = tree[id]["styles"][prop]
    }

    // ذخیره آیدی المنت داخل خود المنت که بعدا بتونیم بهش دسترسی داشته باشیم(از طریق درخت و آیدی میتونیم به نوعش دسترسی داشته باشیم و هربار که صفحه رو پاک میکنیم بتونیم دوباره بسازیمش )
    el.dataset.id = id


    // اعمال ویژگی ها روی المنت
    for (let prop in tree[id]["props"]){
        el.setAttribute(prop, tree[id]["props"][prop])
    }
    // اگه کاربر روی المنتی که خودش ساخته کلیک کرد بورد بزار براش
    if (id == currentParentId){
        el.className = "selectedUserElement"
    }

    // این یه تابع بازگشتیه و تا وقتی که به آخرین فرزند برسه هی میره داخل
    // زمانی که به آخرین فرزند رسید فرزند رو میسازه و برمیگرده عقب
    for (let child of tree[id]["children"]){


        el.appendChild(buildEl(child))

    }

    // برگردوندن المنت ساخته شده برای نمایش توی صفحه
    return el
}


// باید درخت رو خالی کنه و دوباره درخت رو بسازه
let addNode = function(){
    // بررسی اینکه کاربر از تول باکس المنت انتخاب کرده یا نه(اگه کرده شرط درسته)
    if(currentBtn){
    
        // چک کردن اینکه والد میتونه فرزند داشته باشه یا نه(اگه داشت شرط درسته)
        if (elements[tree[currentParentId]["type"]]["canHaveChildren"]){

            // چک کردن اینکه والد میتونه هر نوع فرزندی داشته باشه یا نه(اگه همه نوع رو میتونست شرط درسته)
            if(elements[tree[currentParentId]["type"]]["allowedChildren"] == null){

                // فرزند لیست نباشه
                if(currentBtn.value != "li"){
                tree[lastId] = {"id": lastId, "type": currentBtn.value, "parentId": currentParentId, "children": [], "styles": {}, "props": {}}
                tree[currentParentId].children.push(lastId)
                lastId++
                }

                // فرزند لیست بود ارور بده چون لیست فقط باید داخل والد هایی باشه که نمیتونه همه نوع فرزندی داشته باشه
                else{
                    alert("(li) tag only can build in (ol) tag or (ul) tag")
                }
            }

            // اگه والد فقط نوع خاصی از فرزند ها رو میتونست داشته باشه(ol , ul)
            else{

                // اگه فرزند لیست بود درسته بسازش
                if (currentBtn.value == "li"){

                    // ساخت المنت های جدید
                    tree[lastId] = {"id": lastId, "type": currentBtn.value, "parentId": currentParentId, "children": [], "styles": {}, "text": null}

                    // اضافه کردن فرزند (المنت جدید) به والد
                    tree[currentParentId].children.push(lastId)
                    lastId++
                }

                // اگه فرزند لیست نبود ارور بده
                else{
                alert(`(${tree[currentParentId]["type"]}) only can have li child`)
                }
            }
        }
        
        // اگه والدی که انتخاب کرده فرزند نمیگیره الرت بده
        else
            alert("This type can't have children")
    }
}


// delete
// حذف خود المنت و همه فرزندهاش از درخت
// این تابع هم بازگشتیه
let deleteNode = function(id){

    // انقدر میره داخل تا دیگه فرزندی نداشته باشه و بعد کل اون آیدی رو از درخت حدف میکنه
    for (let child of tree[id]["children"]){
        deleteNode(child)
    }
    delete tree[id]
}

let removeNode = function(id){

    // نگه داشتن آیدی والد تا بعد از خذف المنت بتونیم به والد برگردیم
    let parentId = tree[id]["parentId"]

    if (tree[id]["children"].length > 0){

        // اگه المنت فرزند داشت قبل حذف کردن از کاربر اجازه بگیر
        if (!confirm("این المنت فرزند دارد. همه حذف شوند؟"))
            return
    }

    // حذف آیدی این المنت از لیست فرزند های والدش
    tree[parentId]["children"] = tree[parentId]["children"].filter(child => child != id)
    deleteNode(id)

    // انتخاب دوباره والد بعد از حذف المنت
    currentParentId = parentId
    render()
    buildStyleBox(parentId)
}

let addStyle = function(style, id){
    styleBox.innerHTML = ""

    // ساخت ورودی برای اینکه کاربر مقدار استایل رو وارد کنه
    let input = document.createElement("input")
    let changeBtn = document.createElement("button")
    let backBtn = document.createElement("button")
    let inputType

    // تعیین نوع ورودی با توجه به نوع استایل
    inputType = style["type"]
    input.setAttribute("type", inputType)
    input.setAttribute("placeholder", `enter ${style["prop"]}`)

    changeBtn.setAttribute("type", "button")
    changeBtn.setAttribute("class", "changeBtn")
    changeBtn.innerHTML = "Change"

    backBtn.setAttribute("type", "button")
    backBtn.setAttribute("class", "changeBtn")
    backBtn.innerHTML = "Back"


    // گرفتن مقدار وارد شده و آماده کردنش برای ذخیره توی درخت
    changeBtn.addEventListener("click", () => {
        let styleValue

        if (input.value){

            // اگه استایل واحد پیش فرض داشت به مقدار اضافه کن و بعد ذخیره کن
            if (style["unit"]){
                styleValue = `${input.value}${style["unit"]}`
            }

            else{
                styleValue = input.value
            }
            tree[id]["styles"][style["prop"]] = styleValue

        }

        render()
        buildStyleBox(id)
        })

        // برگشتن به تنظیمات المنت بدون تغییر دادن استیل
        backBtn.addEventListener("click", () => {
            render()
            buildStyleBox(id)
        })


        styleBox.appendChild(input)
        styleBox.appendChild(changeBtn)
        styleBox.appendChild(backBtn)
    
}

let addProp = function(prop, id){
    let propElement
    let changeBtn = document.createElement("button")
    changeBtn.setAttribute("type", "button")
    changeBtn.setAttribute("class", "changeBtn")
    changeBtn.innerHTML = "Change"

    let backBtn = document.createElement("button")
    backBtn.setAttribute("type", "button")
    backBtn.setAttribute("class", "changeBtn")
    backBtn.innerHTML = "Back"


    if (prop["type"] == "text"){
        styleBox.innerHTML = ""

        let propInput = document.createElement("input")
        propInput.setAttribute("type", "text")
        propElement = propInput
        styleBox.appendChild(propInput)
    }

    else{
        styleBox.innerHTML = ""
        let propSelect = document.createElement("select")
        for (let select in selectFields){
            if (select == prop["prop"]){
                for (let option of selectFields[select]["options"]){
                    let propOption = document.createElement("option")
                    propOption.setAttribute("value", option["value"])
                    propOption.innerHTML = `${option["value"]}: ${option["label"]}`

                    propSelect.appendChild(propOption)
                }
            }
        }
        propElement = propSelect

        styleBox.appendChild(propSelect)
    }

    changeBtn.addEventListener("click", () => {
        tree[id]["props"][prop["prop"]] = propElement.value

        render()
        buildStyleBox(id)
    })

    backBtn.addEventListener("click", () => {
        render()
        buildStyleBox(id)
    })
    styleBox.appendChild(changeBtn)
    styleBox.appendChild(backBtn)
}


// ساخت سی اس اس
buildStyleBox = function(id){
    styleBox.innerHTML = ""

    let styleBtn = document.createElement("button")
    styleBtn.setAttribute("type", "button")
    styleBtn.setAttribute("class", "changeBtn")
    styleBtn.innerHTML = "Styles"
    styleBox.appendChild(styleBtn)

    let textBtn

    if (elements[tree[id]["type"]]["hasText"] && id != "root"){

        let backBtn = document.createElement("button")
        backBtn.setAttribute("type", "button")
        backBtn.setAttribute("class", "changeBtn")
        backBtn.innerHTML = "Back"


        backBtn.addEventListener("click", () => buildStyleBox(id))

        textBtn = document.createElement("button")
        textBtn.setAttribute("type", "button")
        textBtn.setAttribute("class", "changeBtn")
        textBtn.innerHTML = "Add text"

        textBtn.addEventListener("click", () => {
            styleBox.innerHTML = ""

            let textChangeBtn = document.createElement("button")
            textChangeBtn.setAttribute("type", "button")
            textChangeBtn.setAttribute("class", "changeBtn")
            textChangeBtn.innerHTML = "Add"

            let textInput = document.createElement("input")
            textInput.setAttribute("type", "text")

            textChangeBtn.addEventListener("click", () => {
                tree[id]["text"] = textInput.value
                render()
                buildStyleBox(id)
            })

            styleBox.appendChild(textInput)
            styleBox.appendChild(textChangeBtn)
            styleBox.appendChild(backBtn)

        })
        styleBox.appendChild(textBtn)
    }


    styleBtn.addEventListener("click", () => {

        styleBox.innerHTML = ""
        let backBtn = document.createElement("button")
        backBtn.setAttribute("type", "button")
        backBtn.setAttribute("class", "changeBtn")
        backBtn.innerHTML = "Back"


        backBtn.addEventListener("click", () => buildStyleBox(id))


        let type = tree[id]["type"]

        for (let field of styleFields){
            if (field["only"] && !(field["only"].includes(type)))
                continue

            if (field["requires"] && !(elements[type][field["requires"]]))
                continue

            if (field["requiresDisplay"] && tree[id]["styles"]["display"] != field["requiresDisplay"])
                continue

            buildfieldsForStyles(field, id)

    }
    styleBox.appendChild(backBtn)
    })

    if (currentParentId != "root" && elements[tree[currentParentId]["type"]]["props"]){

        let propsBtn = document.createElement("button")
        propsBtn.setAttribute("type", "button")
        propsBtn.setAttribute("class", "changeBtn")
        propsBtn.innerHTML = "Props"
        styleBox.appendChild(propsBtn)
        propsBtn.addEventListener("click", () => {
            styleBox.innerHTML = ""
            let backBtn = document.createElement("button")
            backBtn.setAttribute("type", "button")
            backBtn.setAttribute("class", "changeBtn")
            backBtn.innerHTML = "Back"

            backBtn.addEventListener("click", () => buildStyleBox(id))

            for (let prop of elements[tree[currentParentId]["type"]]["props"]){

                let propBtn = document.createElement("button")
                propBtn.setAttribute("type", "button")
                propBtn.setAttribute("value", prop["prop"])
                propBtn.innerHTML = `${prop["prop"]}: ${prop["label"]}`

                styleBox.appendChild(propBtn)
                propBtn.addEventListener("click", () => addProp(prop, id))
            }
            styleBox.appendChild(backBtn)

        })
    }

    if (id != "root"){
    let deleteBtn = document.createElement("button")
    deleteBtn.setAttribute("type", "button")
    deleteBtn.setAttribute("class", "deleteBtn")
    deleteBtn.innerHTML = "Delete"
    deleteBtn.addEventListener("click", () => removeNode(id))
    styleBox.appendChild(deleteBtn)
}

    styleBox.className = "styleBox"
}

// باید صفحه رو بسازه

let render = function(){
    designArea.innerHTML = ""
    for (let prop in tree["root"]["styles"]){
        designArea.style[prop] = tree["root"]["styles"][prop]
    }

    let newEl
    for (let child of tree["root"]["children"]){
        newEl = buildEl(child)
        designArea.appendChild(newEl)
    }
}


toolBox.addEventListener("click", (event) => {

    if(event.target != toolBox){
        // هرچیزی جز + زد اون المنت رو براش انتخاب کن
        if (event.target.value != "+"){

            if (currentBtn)
            currentBtn.className = ""

            event.target.className = "selectedBtn"
            currentBtn = event.target
        }

        // اگه + زد بیا درخت و صفحه رو بساز
        else{
            addNode()
            render()
        }
    }

})


// برای انتخاب کاربر(عناصری که خودش ساخته)

designArea.addEventListener("click", (event) => {

    // اگه روی المنتی جز دیو اصلی کلیک کرد دورش بوردر بزار و آیدی والد رو نگه دار
    if (event.target.dataset.id){

        currentParentId = event.target.dataset.id
        buildStyleBox(event.target.dataset.id)
        render()
    }

    // اگه روی دیو اصلی کلیک کرد آیدی والد رو بزار روت
    else{

        currentParentId = "root"
        buildStyleBox("root")
        render()
    }
})
