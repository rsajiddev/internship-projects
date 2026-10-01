
        const nameInput = document.getElementById("name");
        const ageInput = document.getElementById("age");
        const cityInput = document.getElementById("city");
        const studentInput = document.getElementById("isStudent");
        const skillInput = document.getElementById("skill");
        const outputText = document.getElementById("outputText");
        var studentStatue = ""

        document.getElementById("generateBtn").addEventListener("click", function () {

            // Get current values from HTML form
            const name = nameInput.value.trim();
            const age = Number(ageInput.value);
            const city = cityInput.value.trim();
            const isStudent = studentInput.value === "true";
            const skill = skillInput.value.trim();


            // Check if form is completely empty
            if (
                !name &&
                !ageInput.value &&
                !city &&
                !studentInput.value &&
                !skill
            ) {
                console.log("No profile data entered.");
                return;
            }
            if (isStudent == true) {
                studentStatue = "I am a student"
            } else {
                studentStatue = "I am not a student"
            }

            // Generate introduction from HTML form data
            const introduction =
                `Hi! My name is ${name}, I am ${age} years old, I live in ${city}, ${studentStatue}, and my skill is ${skill}.`;


            // Show the same data on HTML
            outputText.textContent = introduction;


            // Show the same data in Console
            console.log("========== PROFILE ==========");
            console.log(introduction);

            console.log("-----------------------------");
            console.log("name type:", typeof name);
            console.log("age type:", typeof age);
            console.log("city type:", typeof city);
            console.log("isStudent type:", typeof isStudent);
            console.log("skill type:", typeof skill);
            console.log("=============================");
        });


        /* -----------------------------
           DAY 1 - TASK 2: Shop Bill Calculator
           ----------------------------- */
        const calculateBtn = document.getElementById("calculateBtn");

        calculateBtn.addEventListener("click", function () {

            // Get current values from HTML form
            const item1 = document.getElementById("item1").value.trim();
            const price1 = Number(document.getElementById("price1").value);
            const quantity1 = Number(document.getElementById("qty1").value);

            const item2 = document.getElementById("item2").value.trim();
            const price2 = Number(document.getElementById("price2").value);
            const quantity2 = Number(document.getElementById("qty2").value);

            const item3 = document.getElementById("item3").value.trim();
            const price3 = Number(document.getElementById("price3").value);
            const quantity3 = Number(document.getElementById("qty3").value);


            // Check if form is completely empty
            const isEmpty =
                !item1 && !price1 && !quantity1 &&
                !item2 && !price2 && !quantity2 &&
                !item3 && !price3 && !quantity3;

            if (isEmpty) {
                console.log("No bill data entered.");
                return;
            }


            // Calculate individual item totals
            const itemTotal1 = price1 * quantity1;
            const itemTotal2 = price2 * quantity2;
            const itemTotal3 = price3 * quantity3;


            // Calculate subtotal
            const subtotal = itemTotal1 + itemTotal2 + itemTotal3;


            // Calculate discount
            const discount = subtotal * 0.05;
            const amountAfterDiscount = subtotal - discount;


            // Calculate GST
            const gst = amountAfterDiscount * 0.17;


            // Calculate final total
            const finalTotal = amountAfterDiscount + gst;


            // Show calculation on HTML
            document.getElementById("subtotal").textContent =
                "Rs " + subtotal.toFixed(2);

            document.getElementById("discount").textContent =
                "Rs " + discount.toFixed(2);

            document.getElementById("gst").textContent =
                "Rs " + gst.toFixed(2);

            document.getElementById("finalTotal").textContent =
                "Rs " + finalTotal.toFixed(2);


            // Show the same form data and calculation in Console
            console.log(`
========== SHOP BILL ==========

${item1} x ${quantity1} @ Rs ${price1} = Rs ${itemTotal1.toFixed(2)}
${item2} x ${quantity2} @ Rs ${price2} = Rs ${itemTotal2.toFixed(2)}
${item3} x ${quantity3} @ Rs ${price3} = Rs ${itemTotal3.toFixed(2)}

-------------------------------
Subtotal       : Rs ${subtotal.toFixed(2)}
Discount (5%)  : Rs ${discount.toFixed(2)}
GST (17%)      : Rs ${gst.toFixed(2)}
Final Total    : Rs ${finalTotal.toFixed(2)}
===============================
`);
        });


        /* -----------------------------
           DAY 1 - TASK 3: Converters and String Utilities
           ----------------------------- */
        // DAY 1 - TASK 3: Converters and String Utilities

        // -----------------------------
        // HTML Elements
        // -----------------------------

        const celsiusInput = document.getElementById("celsius");
        const convertBtn = document.getElementById("convertBtn");
        const fahrenheitResult = document.getElementById("fahrenheitResult");

        const emailInput = document.getElementById("email");
        const processEmailBtn = document.getElementById("processEmailBtn");

        const cleanEmailResult = document.getElementById("cleanEmail");
        const containsAtResult = document.getElementById("containsAt");
        const endsWithComResult = document.getElementById("endsWithCom");

        const numberInput = document.getElementById("number");
        const squareBtn = document.getElementById("squareBtn");
        const squareResult = document.getElementById("squareResult");


        // -----------------------------
        // Temperature Converter
        // -----------------------------

        convertBtn.addEventListener("click", () => {

            const celsius = Number(celsiusInput.value);
            const fahrenheit = (celsius * 9 / 5) + 32;

            // Show result on HTML
            fahrenheitResult.textContent = `${fahrenheit} °F`;

            // Show same values in Console
            console.log("=== Temperature Converter ===");
            console.log(`${celsius}°C = ${fahrenheit}°F`);
        });


        // -----------------------------
        // String Utilities
        // -----------------------------

        processEmailBtn.addEventListener("click", () => {

            const email = emailInput.value;
            const cleanEmail = email.trim().toLowerCase();

            const containsAt = cleanEmail.includes("@");
            const endsWithCom = cleanEmail.endsWith(".com");

            // Show results on HTML
            cleanEmailResult.textContent = cleanEmail;
            containsAtResult.textContent = containsAt;
            endsWithComResult.textContent = endsWithCom;

            // Show same values in Console
            console.log("\n=== String Utilities ===");
            console.log("Original email:", email);
            console.log("Clean email:", cleanEmail);
            console.log("Contains @:", containsAt);
            console.log("Ends with .com:", endsWithCom);
        });


        // -----------------------------
        // Square Calculator
        // -----------------------------

        squareBtn.addEventListener("click", () => {

            const userNumber = Number(numberInput.value);
            const square = userNumber * userNumber;

            // Show result on HTML
            squareResult.textContent = square;

            // Show same values in Console
            console.log("\n=== Square Calculator ===");
            console.log(`Number: ${userNumber}`);
            console.log(`Square of ${userNumber} = ${square}`);
        });

