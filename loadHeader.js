fetch('header.html')
    .then(res => res.text())
    .then(data => {
        const container = document.getElementById('header-container');
        container.innerHTML = data;

        // 让 header 中的 script 自动执行
        const scripts = container.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            if (oldScript.src) {
                newScript.src = oldScript.src;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            document.body.appendChild(newScript);
        });
    });
