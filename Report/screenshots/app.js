var app = angular.module('reportingApp', []);

app.controller('ScreenshotReportController', function ($scope) {
    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, {}); // enable customisation of search settings on first page hit

    var initialColumnSettings = undefined; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        }

    }


    $scope.inlineScreenshots = false;
    this.showSmartStackTraceHighlight = true;

    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        var arr = str.split('|');
        str = "";
        for (var i = arr.length - 2; i > 0; i--) {
            str += arr[i] + " > ";
        }
        return str.slice(0, -3);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };


    this.getShortDescription = function (str) {
        return str.split('|')[0];
    };

    this.convertTimestamp = function (timestamp) {
        var d = new Date(timestamp),
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),
            dd = ('0' + d.getDate()).slice(-2),
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2),
            ampm = 'AM',
            time;

        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh === 0) {
            h = 12;
        }

        // ie: 2013-02-18, 8:35 AM
        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

        return time;
    };


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };


    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };

    this.applySmartHighlight = function (line) {
        if (this.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return true;
    };


    var results = [
    {
        "description": "Find restuarant in particular region and check if it is displayed|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "704afb945090859e3e74fea62710056e",
        "instanceId": 4148,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22wla1e4atv2nnt0lp2j3r13n381538976587068%22%2C%22sessionId%22%3A%22siw8pzx3do7sksle0lgoixpx81538976587068%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A29%3A47.068Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T05%3A29%3A47.947Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%222b66747b-cabb-11e8-982d-4f8340b85f89%22%2C%22v2SessionId%22%3A%222b66e9ac-cabb-11e8-afe9-bda66085afc3%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538976589874,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538976599421,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538976605170,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538976633410,
                "type": ""
            }
        ],
        "screenShotFile": "00a3006e-000a-0083-004c-005e00cd0044.png",
        "timestamp": 1538976580700,
        "duration": 68132
    },
    {
        "description": "Find restuarant in particular region and order from 4 star|Suite for Restaurant page",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "704afb945090859e3e74fea62710056e",
        "instanceId": 4148,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Wait timed out after 10011ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 10011ms\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Register.createyouraccount (D:\\e2etests\\PageObject\\SignUpPage.js:72:13)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:34:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Find restuarant in particular region and order from 4 star\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:32:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:12:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00f100f4-0013-008d-0028-007900cb005a.png",
        "timestamp": 1538976649647,
        "duration": 16323
    },
    {
        "description": "Sorting restaurant according to distance and verifying|Suite for Restaurant page",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "704afb945090859e3e74fea62710056e",
        "instanceId": 4148,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Wait timed out after 10014ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 10014ms\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Register.createyouraccount (D:\\e2etests\\PageObject\\SignUpPage.js:72:13)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:43:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Sorting restaurant according to distance and verifying\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:41:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:12:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "0080001f-0048-008d-0040-0001007e0006.png",
        "timestamp": 1538976666653,
        "duration": 14827
    },
    {
        "description": "Open a restaurant page and save it|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0744bd7e8e85bd918f1b9eb6d6866120",
        "instanceId": 6452,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22lzm5c1onktmcxt1vtg7051ukf1538976691937%22%2C%22sessionId%22%3A%22n18vluukwi1cbuamnjloax0p61538976691937%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A31%3A31.937Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T05%3A31%3A32.920Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2269e831cf-cabb-11e8-bd69-5b063488fe35%22%2C%22v2SessionId%22%3A%2269e858d1-cabb-11e8-a620-214ba611cf79%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538976694922,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538976699177,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538976700815,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538976710991,
                "type": ""
            }
        ],
        "screenShotFile": "00030034-0067-00f8-0050-00d8005b0057.png",
        "timestamp": 1538976685345,
        "duration": 39911
    },
    {
        "description": "Find restuarant in particular region and check if it is displayed|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "86a0b27ee17dabceb23e1c229c5a95de",
        "instanceId": 7492,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22puptk3vsbbgk1pbfvm4l0946l1538976742244%22%2C%22sessionId%22%3A%229ljvpv5zvgru5ghw4h1ogci1y1538976742243%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A32%3A22.242Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A3%2C%22dateTime%22%3A%222018-10-08T05%3A32%3A22.252Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2287e46ef9-cabb-11e8-878f-addbe658400e%22%2C%22v2SessionId%22%3A%2287e4bd1d-cabb-11e8-a117-0f3cdba44e0b%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538976743705,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538976748476,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538976749872,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538976760148,
                "type": ""
            }
        ],
        "screenShotFile": "00a800ff-00f6-007f-00a5-009a00ed00a3.png",
        "timestamp": 1538976734917,
        "duration": 32031
    },
    {
        "description": "Find restuarant in particular region and check if it is displayed|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "b1b87337673f6e72bd6710023cbb0cb6",
        "instanceId": 8696,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ze0mmog7dtbefjk0mqv5944jj1538976876701%22%2C%22sessionId%22%3A%22ahdcbz3l0zp1su7t1injw1w1y1538976876700%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A34%3A36.700Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-08T05%3A34%3A37.392Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22d808f18d-cabb-11e8-9f5a-4f1e692f3407%22%2C%22v2SessionId%22%3A%22d809189d-cabb-11e8-9f25-a5ba63cb94aa%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538976878558,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538976883126,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538976884389,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538976893779,
                "type": ""
            }
        ],
        "screenShotFile": "00250029-0069-00d8-00d4-0018001700e5.png",
        "timestamp": 1538976870940,
        "duration": 27874
    },
    {
        "description": "Find restuarant in particular region and order from 4 star|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "b1b87337673f6e72bd6710023cbb0cb6",
        "instanceId": 8696,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ze0mmog7dtbefjk0mqv5944jj1538976876701%22%2C%22sessionId%22%3A%22ahdcbz3l0zp1su7t1injw1w1y1538976876700%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A34%3A36.700Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T05%3A35%3A02.971Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22d808f18d-cabb-11e8-9f5a-4f1e692f3407%22%2C%22v2SessionId%22%3A%22d809189d-cabb-11e8-9f25-a5ba63cb94aa%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538976903369,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538976912617,
                "type": ""
            }
        ],
        "screenShotFile": "002100d7-0092-00c7-0097-00bc00ba009b.png",
        "timestamp": 1538976900339,
        "duration": 49414
    },
    {
        "description": "Sorting restaurant according to distance and verifying|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "b1b87337673f6e72bd6710023cbb0cb6",
        "instanceId": 8696,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ze0mmog7dtbefjk0mqv5944jj1538976876701%22%2C%22sessionId%22%3A%22ahdcbz3l0zp1su7t1injw1w1y1538976876700%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A34%3A36.700Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T05%3A35%3A54.140Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22d808f18d-cabb-11e8-9f5a-4f1e692f3407%22%2C%22v2SessionId%22%3A%22d809189d-cabb-11e8-9f25-a5ba63cb94aa%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538976954513,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538976965605,
                "type": ""
            }
        ],
        "screenShotFile": "00d6000c-0070-00f1-0047-00c500c80078.png",
        "timestamp": 1538976951452,
        "duration": 21139
    },
    {
        "description": "Open a restaurant page and save it|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "8b4b00d8afe67fb94db0176abc6c32e2",
        "instanceId": 5276,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a.ghs-goToCreateAccount)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a.ghs-goToCreateAccount)\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Register.createyouraccount (D:\\e2etests\\PageObject\\SignUpPage.js:74:19)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:28:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Open a restaurant page and save it\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:26:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22dbbvyp0gq0dj4i3iebspn0out1538976982670%22%2C%22sessionId%22%3A%22vdimzsisy7og0j27b8g581diu1538976982668%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A36%3A22.668Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-08T05%3A36%3A23.476Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2217326081-cabc-11e8-9a6c-cfa356a35bf3%22%2C%22v2SessionId%22%3A%2217328797-cabc-11e8-90d2-ffc4d50c8fb3%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538976984277,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538976991110,
                "type": ""
            }
        ],
        "screenShotFile": "001300c7-00db-0009-0051-00d5009c00af.png",
        "timestamp": 1538976976991,
        "duration": 14461
    },
    {
        "description": "Signing up with valid details and verifying the profile name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ta5247v21e6vefgk7sr49n98t1538977004880%22%2C%22sessionId%22%3A%224kc3imcknqfq3ht6xszp8fbv51538977004878%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A36%3A44.878Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A3%2C%22dateTime%22%3A%222018-10-08T05%3A36%3A44.891Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22246e704c-cabc-11e8-a0cd-49b50da5fd3b%22%2C%22v2SessionId%22%3A%22246ee571-cabc-11e8-9c5f-0f85285e8681%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538977006712,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538977010766,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538977011955,
                "type": ""
            }
        ],
        "screenShotFile": "009b0036-00d8-00b4-006c-005000bf0038.png",
        "timestamp": 1538976995817,
        "duration": 25492
    },
    {
        "description": "Signing up with same email id twice|Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected 'vikash!' not to equal 'vikash!'."
        ],
        "trace": [
            "Error: Failed expectation\n    at Register.validateNotRegistered (D:\\e2etests\\PageObject\\SignUpPage.js:58:44)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:36:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ta5247v21e6vefgk7sr49n98t1538977004880%22%2C%22sessionId%22%3A%224kc3imcknqfq3ht6xszp8fbv51538977004878%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A36%3A44.878Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T05%3A37%3A05.572Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22246e704c-cabc-11e8-a0cd-49b50da5fd3b%22%2C%22v2SessionId%22%3A%22246ee571-cabc-11e8-9c5f-0f85285e8681%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538977025923,
                "type": ""
            }
        ],
        "screenShotFile": "00ff0015-003c-00a2-0042-002e00f5009b.png",
        "timestamp": 1538977022925,
        "duration": 24631
    },
    {
        "description": "Signing up without entering first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ta5247v21e6vefgk7sr49n98t1538977004880%22%2C%22sessionId%22%3A%224kc3imcknqfq3ht6xszp8fbv51538977004878%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A36%3A44.878Z%22%2C%22userId%22%3A%2253851398%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T05%3A37%3A31.624Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22246e704c-cabc-11e8-a0cd-49b50da5fd3b%22%2C%22v2SessionId%22%3A%22246ee571-cabc-11e8-9c5f-0f85285e8681%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538977051960,
                "type": ""
            }
        ],
        "screenShotFile": "00180063-00c0-002e-0070-0024001800d0.png",
        "timestamp": 1538977049136,
        "duration": 6049
    },
    {
        "description": "Signing up without entering last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0069007b-003c-00c2-00ca-004f0058007c.png",
        "timestamp": 1538977055690,
        "duration": 5317
    },
    {
        "description": "Signing up without entering email|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0063000d-0070-0078-00b7-0079007100fe.png",
        "timestamp": 1538977061472,
        "duration": 5977
    },
    {
        "description": "Signing up without entering password|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004f0075-0044-000c-0065-00a9008d0024.png",
        "timestamp": 1538977067946,
        "duration": 6117
    },
    {
        "description": "Signing up without entering anything|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00210053-00d0-00b1-0084-005300db00fb.png",
        "timestamp": 1538977074569,
        "duration": 5238
    },
    {
        "description": "Signing up with entering numbers in first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009200d5-0003-001f-009b-0003000b0085.png",
        "timestamp": 1538977080296,
        "duration": 6367
    },
    {
        "description": "Signing up with entering non-allowed characters in first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f100f7-0062-00e6-00e6-00e2000900e6.png",
        "timestamp": 1538977087137,
        "duration": 5642
    },
    {
        "description": "Signing up with entering numbers in last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b500d4-0058-00a6-0074-003400bc00cf.png",
        "timestamp": 1538977093259,
        "duration": 5536
    },
    {
        "description": "Signing up with entering non-allowed characters in last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009000fa-0051-001e-006c-003400c300cd.png",
        "timestamp": 1538977099306,
        "duration": 5503
    },
    {
        "description": "Signing up with entering invalid id |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d50011-00dc-0049-0062-00e700d300d1.png",
        "timestamp": 1538977105321,
        "duration": 4517
    },
    {
        "description": "Signing up with entering password as \"password\" |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00dd0064-006b-00cc-0062-00de005e0081.png",
        "timestamp": 1538977110336,
        "duration": 4481
    },
    {
        "description": "Signing up with entering password less than 8 characters |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00c80021-0047-0060-00ee-00ae006a002c.png",
        "timestamp": 1538977115284,
        "duration": 5350
    },
    {
        "description": "Signing up with entering password more than 255 characters |Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, [at-msg-name=\"password\"])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, [at-msg-name=\"password\"])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as getText] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as getText] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Register.passwordLength (D:\\e2etests\\PageObject\\SignUpPage.js:138:26)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:115:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Signing up with entering password more than 255 characters \") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:112:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:10:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00db00b2-00e3-00f8-007c-00a100b4001c.png",
        "timestamp": 1538977121128,
        "duration": 10570
    },
    {
        "description": "Open a restaurant page and save it|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "fb19cd7e62ad0d7c967f4f565ca47df7",
        "instanceId": 7320,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22x7wn8reeqr7pjzsj319nuivqj1538977142711%22%2C%22sessionId%22%3A%224qlmd6m8ypvuavhjtf96eqly21538977142710%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A39%3A02.710Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T05%3A39%3A03.416Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%227696b213-cabc-11e8-922e-23c63486ace3%22%2C%22v2SessionId%22%3A%2276970036-cabc-11e8-970f-89be07c41b7a%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538977145252,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538977150607,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538977152318,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538977161552,
                "type": ""
            }
        ],
        "screenShotFile": "00300081-0050-005a-0053-00630041001c.png",
        "timestamp": 1538977136446,
        "duration": 39802
    },
    {
        "description": "Signing up with valid details and verifying the profile name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22707ih7r8zdemxsssh2wjvvs2s1538977188015%22%2C%22sessionId%22%3A%22idpby8gla3el3or0iarjtkbu01538977188015%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A39%3A48.014Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T05%3A39%3A48.878Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%229197d7b2-cabc-11e8-bd61-8bbd8151d547%22%2C%22v2SessionId%22%3A%229197fecb-cabc-11e8-be17-d1e3ebd78461%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538977191119,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538977195184,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538977196732,
                "type": ""
            }
        ],
        "screenShotFile": "004e006b-0026-00d9-002b-002d00c20026.png",
        "timestamp": 1538977182107,
        "duration": 24179
    },
    {
        "description": "Signing up with same email id twice|Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected 'vikash!' not to equal 'vikash!'."
        ],
        "trace": [
            "Error: Failed expectation\n    at Register.validateNotRegistered (D:\\e2etests\\PageObject\\SignUpPage.js:58:44)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:36:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22707ih7r8zdemxsssh2wjvvs2s1538977188015%22%2C%22sessionId%22%3A%22idpby8gla3el3or0iarjtkbu01538977188015%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A39%3A48.014Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T05%3A40%3A10.409Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%229197d7b2-cabc-11e8-bd61-8bbd8151d547%22%2C%22v2SessionId%22%3A%229197fecb-cabc-11e8-be17-d1e3ebd78461%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538977210741,
                "type": ""
            }
        ],
        "screenShotFile": "0045005e-0041-0045-001e-007d004700fe.png",
        "timestamp": 1538977207616,
        "duration": 23540
    },
    {
        "description": "Signing up without entering first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22707ih7r8zdemxsssh2wjvvs2s1538977188015%22%2C%22sessionId%22%3A%22idpby8gla3el3or0iarjtkbu01538977188015%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A39%3A48.014Z%22%2C%22userId%22%3A%2253851438%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T05%3A40%3A35.453Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%229197d7b2-cabc-11e8-bd61-8bbd8151d547%22%2C%22v2SessionId%22%3A%229197fecb-cabc-11e8-be17-d1e3ebd78461%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538977235824,
                "type": ""
            }
        ],
        "screenShotFile": "005d008b-0035-0008-00a6-0091003400a7.png",
        "timestamp": 1538977232661,
        "duration": 6786
    },
    {
        "description": "Signing up without entering last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001900c2-001b-00b2-0069-00da007a003c.png",
        "timestamp": 1538977239947,
        "duration": 5672
    },
    {
        "description": "Signing up without entering email|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0095008b-005c-0051-00ca-0091001e0078.png",
        "timestamp": 1538977246103,
        "duration": 6599
    },
    {
        "description": "Signing up without entering password|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001000d5-0068-0027-005d-002c0067002a.png",
        "timestamp": 1538977253205,
        "duration": 6024
    },
    {
        "description": "Signing up without entering anything|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004b00a4-00d2-003d-0096-008900b40022.png",
        "timestamp": 1538977259722,
        "duration": 5564
    },
    {
        "description": "Signing up with entering numbers in first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a700ae-0062-005d-0010-00d400ad0038.png",
        "timestamp": 1538977265742,
        "duration": 4815
    },
    {
        "description": "Signing up with entering non-allowed characters in first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007900c8-0044-008b-00c8-00b400c9003f.png",
        "timestamp": 1538977271039,
        "duration": 4575
    },
    {
        "description": "Signing up with entering numbers in last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003a00e4-0010-003e-0000-006c00ab00a4.png",
        "timestamp": 1538977276127,
        "duration": 7118
    },
    {
        "description": "Signing up with entering non-allowed characters in last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00150071-003a-0003-00ac-00d1009e0041.png",
        "timestamp": 1538977283725,
        "duration": 7675
    },
    {
        "description": "Signing up with entering invalid id |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004500a9-00dc-003e-00dc-005d001100f4.png",
        "timestamp": 1538977292016,
        "duration": 5380
    },
    {
        "description": "Signing up with entering password as \"password\" |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004900aa-0044-00d9-009e-000500d8008a.png",
        "timestamp": 1538977297910,
        "duration": 5719
    },
    {
        "description": "Signing up with entering password less than 8 characters |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00890092-0058-00c2-00d2-006c00120031.png",
        "timestamp": 1538977304116,
        "duration": 5843
    },
    {
        "description": "Signing up with entering password more than 255 characters |Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, [at-msg-name=\"password\"])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, [at-msg-name=\"password\"])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as getText] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as getText] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Register.passwordLength (D:\\e2etests\\PageObject\\SignUpPage.js:138:26)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:115:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Signing up with entering password more than 255 characters \") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:112:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:10:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00f6003f-0094-0082-0016-003300190023.png",
        "timestamp": 1538977310449,
        "duration": 10232
    },
    {
        "description": "Signing up with valid details and verifying the profile name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "fbf30be974f635e6215db12d190629f0",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22dz7kwjnn8idsrzxm6s2evtrpp1538984357822%22%2C%22sessionId%22%3A%228psxmeoh7cr98kb3zmguqobay1538984357821%22%2C%22sessionStartDateTime%22%3A%222018-10-08T07%3A39%3A17.821Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T07%3A39%3A18.829Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22432191a0-cacd-11e8-8957-95ff6b7ddd5d%22%2C%22v2SessionId%22%3A%224321dfc1-cacd-11e8-9db4-271dd25349b0%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538984360295,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538984364764,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538984366263,
                "type": ""
            }
        ],
        "screenShotFile": "005e0035-0066-00fb-00b7-0037001a0061.png",
        "timestamp": 1538984351144,
        "duration": 24632
    },
    {
        "description": "Signing up with same email id twice|Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "fbf30be974f635e6215db12d190629f0",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected 'vikash!' not to equal 'vikash!'."
        ],
        "trace": [
            "Error: Failed expectation\n    at Register.validateNotRegistered (D:\\e2etests\\PageObject\\SignUpPage.js:58:44)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:36:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22dz7kwjnn8idsrzxm6s2evtrpp1538984357822%22%2C%22sessionId%22%3A%228psxmeoh7cr98kb3zmguqobay1538984357821%22%2C%22sessionStartDateTime%22%3A%222018-10-08T07%3A39%3A17.821Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T07%3A39%3A40.383Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22432191a0-cacd-11e8-8957-95ff6b7ddd5d%22%2C%22v2SessionId%22%3A%224321dfc1-cacd-11e8-9db4-271dd25349b0%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538984380835,
                "type": ""
            }
        ],
        "screenShotFile": "00e800ff-008b-0054-0064-003c0069008a.png",
        "timestamp": 1538984377482,
        "duration": 24380
    },
    {
        "description": "Signing up without entering first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "fbf30be974f635e6215db12d190629f0",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22dz7kwjnn8idsrzxm6s2evtrpp1538984357822%22%2C%22sessionId%22%3A%228psxmeoh7cr98kb3zmguqobay1538984357821%22%2C%22sessionStartDateTime%22%3A%222018-10-08T07%3A39%3A17.821Z%22%2C%22userId%22%3A%2253852328%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T07%3A40%3A05.690Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22432191a0-cacd-11e8-8957-95ff6b7ddd5d%22%2C%22v2SessionId%22%3A%224321dfc1-cacd-11e8-9db4-271dd25349b0%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538984406099,
                "type": ""
            }
        ],
        "screenShotFile": "00cf0020-0041-0005-003b-007900cb0088.png",
        "timestamp": 1538984403299,
        "duration": 6102
    },
    {
        "description": "Signing up without entering last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "fbf30be974f635e6215db12d190629f0",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000a00a5-007f-00dc-00b4-001300920019.png",
        "timestamp": 1538984409881,
        "duration": 5731
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "314e486029546ef27141f66068395f4e",
        "instanceId": 5172,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: unknown error: Element <span class=\"s-btn-copy\">...</span> is not clickable at point (990, 10). Other element would receive the click: <div class=\"mainNavCol mainNavSearch\">...</div>\n  (Session info: chrome=69.0.3497.100)\n  (Driver info: chromedriver=2.42.591088 (7b2b2dca23cca0862f674758c9a3933e685c27d5),platform=Windows NT 6.1.7601 SP1 x86_64)"
        ],
        "trace": [
            "WebDriverError: unknown error: Element <span class=\"s-btn-copy\">...</span> is not clickable at point (990, 10). Other element would receive the click: <div class=\"mainNavCol mainNavSearch\">...</div>\n  (Session info: chrome=69.0.3497.100)\n  (Driver info: chromedriver=2.42.591088 (7b2b2dca23cca0862f674758c9a3933e685c27d5),platform=Windows NT 6.1.7601 SP1 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: WebElement.click()\n    at thenableWebDriverProxy.schedule (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at WebElement.schedule_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:2010:25)\n    at WebElement.click (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:2092:17)\n    at actionFn (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:89:44)\n    at Array.map (<anonymous>)\n    at actionResults.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:461:65)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Restaurant.findfoodatlocation (D:\\e2etests\\PageObject\\OrderFoodPage.js:52:14)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:29:15)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Save a restaurant in restaurant page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:26:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22dh6lba16ue5obfh5zebxasdzk1538984514286%22%2C%22sessionId%22%3A%221zqkom86vmxrbi4rran0xsemt1538984514285%22%2C%22sessionStartDateTime%22%3A%222018-10-08T07%3A41%3A54.284Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-08T07%3A41%3A54.921Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22a0637862-cacd-11e8-9ca9-353fd2f9eac2%22%2C%22v2SessionId%22%3A%22a063ed95-cacd-11e8-9a41-7590ed9a1a22%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538984516162,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538984521097,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538984522442,
                "type": ""
            }
        ],
        "screenShotFile": "00ac008a-00af-0047-0001-006c0072001c.png",
        "timestamp": 1538984508473,
        "duration": 21202
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "314e486029546ef27141f66068395f4e",
        "instanceId": 5172,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Wait timed out after 10030ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 10030ms\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Register.createyouraccount (D:\\e2etests\\PageObject\\SignUpPage.js:72:13)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:42:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "001a0048-0038-0074-009e-009200e600af.png",
        "timestamp": 1538984530141,
        "duration": 14003
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "9cd2c10107cb5168090f34fa5ef99709",
        "instanceId": 8492,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: unknown error: Element <span class=\"s-btn-copy\">...</span> is not clickable at point (990, 10). Other element would receive the click: <div class=\"mainNavCol mainNavSearch\">...</div>\n  (Session info: chrome=69.0.3497.100)\n  (Driver info: chromedriver=2.42.591088 (7b2b2dca23cca0862f674758c9a3933e685c27d5),platform=Windows NT 6.1.7601 SP1 x86_64)"
        ],
        "trace": [
            "WebDriverError: unknown error: Element <span class=\"s-btn-copy\">...</span> is not clickable at point (990, 10). Other element would receive the click: <div class=\"mainNavCol mainNavSearch\">...</div>\n  (Session info: chrome=69.0.3497.100)\n  (Driver info: chromedriver=2.42.591088 (7b2b2dca23cca0862f674758c9a3933e685c27d5),platform=Windows NT 6.1.7601 SP1 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: WebElement.click()\n    at thenableWebDriverProxy.schedule (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at WebElement.schedule_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:2010:25)\n    at WebElement.click (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:2092:17)\n    at actionFn (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:89:44)\n    at Array.map (<anonymous>)\n    at actionResults.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:461:65)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Restaurant.findfoodatlocation (D:\\e2etests\\PageObject\\OrderFoodPage.js:52:14)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:29:15)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Save a restaurant in restaurant page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:26:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22sizmiru1r79eqg1x6ssxtziir1538984561537%22%2C%22sessionId%22%3A%224juwpd64m0wybt5w2g76y5hes1538984561535%22%2C%22sessionStartDateTime%22%3A%222018-10-08T07%3A42%3A41.535Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T07%3A42%3A42.467Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22bc8db4b5-cacd-11e8-9bf1-f507fea66d46%22%2C%22v2SessionId%22%3A%22bc8e02df-cacd-11e8-808d-557e4d95a14f%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538984563568,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538984567216,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538984568816,
                "type": ""
            }
        ],
        "screenShotFile": "00ab009c-003d-00f1-00e3-003c00b900bb.png",
        "timestamp": 1538984555730,
        "duration": 20414
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "9cd2c10107cb5168090f34fa5ef99709",
        "instanceId": 8492,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Wait timed out after 10017ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 10017ms\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Register.createyouraccount (D:\\e2etests\\PageObject\\SignUpPage.js:72:13)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:42:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "009d00ab-006d-0055-00f8-00b800d3002e.png",
        "timestamp": 1538984576616,
        "duration": 13983
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "798cca15352e4cfa54eee6d0a54230fb",
        "instanceId": 6772,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Cannot read property 'bind' of undefined"
        ],
        "trace": [
            "TypeError: Cannot read property 'bind' of undefined\n    at ProtractorExpectedConditions.presenceOf (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\expectedConditions.js:341:40)\n    at ProtractorExpectedConditions.visibilityOf (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\expectedConditions.js:381:30)\n    at Restaurant.findfoodatlocation (D:\\e2etests\\PageObject\\OrderFoodPage.js:51:21)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:29:15)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\nFrom: Task: Run it(\"Save a restaurant in restaurant page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:26:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22wur7bjam8r5jz5e9a65yzy9bq1538984858226%22%2C%22sessionId%22%3A%22f9e7rogjzbbj6yo4f0i1mpdiv1538984858225%22%2C%22sessionStartDateTime%22%3A%222018-10-08T07%3A47%3A38.224Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T07%3A47%3A39.273Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%226d648ca2-cace-11e8-812b-51822cf2596d%22%2C%22v2SessionId%22%3A%226d64dac2-cace-11e8-95a0-a7e74e549af3%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538984860965,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538984867358,
                "type": ""
            }
        ],
        "screenShotFile": "005f009f-009f-00e4-00be-009c002700f3.png",
        "timestamp": 1538984851069,
        "duration": 16333
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "798cca15352e4cfa54eee6d0a54230fb",
        "instanceId": 6772,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Cannot read property 'bind' of undefined"
        ],
        "trace": [
            "TypeError: Cannot read property 'bind' of undefined\n    at ProtractorExpectedConditions.presenceOf (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\expectedConditions.js:341:40)\n    at ProtractorExpectedConditions.visibilityOf (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\expectedConditions.js:381:30)\n    at Restaurant.findfoodatlocation (D:\\e2etests\\PageObject\\OrderFoodPage.js:51:21)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:43:15)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "006b00ea-0045-0064-0003-0024003b00df.png",
        "timestamp": 1538984868087,
        "duration": 3880
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "36843904939476ecc6c54c25f45bc062",
        "instanceId": 6952,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Cannot read property 'bind' of undefined"
        ],
        "trace": [
            "TypeError: Cannot read property 'bind' of undefined\n    at ProtractorExpectedConditions.presenceOf (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\expectedConditions.js:341:40)\n    at ProtractorExpectedConditions.visibilityOf (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\expectedConditions.js:381:30)\n    at Restaurant.findfoodatlocation (D:\\e2etests\\PageObject\\OrderFoodPage.js:51:21)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:29:15)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\nFrom: Task: Run it(\"Save a restaurant in restaurant page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:26:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22x5zhee6p2stkdo5m5t13j8tr41538985409036%22%2C%22sessionId%22%3A%22lzihv5o6kglkudv7gds62vo0b1538985409036%22%2C%22sessionStartDateTime%22%3A%222018-10-08T07%3A56%3A49.036Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-08T07%3A56%3A49.762Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22b5b37c49-cacf-11e8-9f30-6f8d33994cf1%22%2C%22v2SessionId%22%3A%22b5b3ca66-cacf-11e8-86df-5773bc6115dc%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538985411059,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538985415576,
                "type": ""
            }
        ],
        "screenShotFile": "00f9000a-000b-0050-0078-0039004c00be.png",
        "timestamp": 1538985402279,
        "duration": 13334
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "36843904939476ecc6c54c25f45bc062",
        "instanceId": 6952,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Cannot read property 'bind' of undefined"
        ],
        "trace": [
            "TypeError: Cannot read property 'bind' of undefined\n    at ProtractorExpectedConditions.presenceOf (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\expectedConditions.js:341:40)\n    at ProtractorExpectedConditions.visibilityOf (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\expectedConditions.js:381:30)\n    at Restaurant.findfoodatlocation (D:\\e2etests\\PageObject\\OrderFoodPage.js:51:21)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:43:15)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "0024001c-0076-0069-00ab-006300fa0032.png",
        "timestamp": 1538985416306,
        "duration": 2607
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "96d04d44f58861a9de2cf8d10c8ce821",
        "instanceId": 5060,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Cannot read property 'bind' of undefined"
        ],
        "trace": [
            "TypeError: Cannot read property 'bind' of undefined\n    at ProtractorExpectedConditions.presenceOf (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\expectedConditions.js:341:40)\n    at ProtractorExpectedConditions.visibilityOf (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\expectedConditions.js:381:30)\n    at Restaurant.findfoodatlocation (D:\\e2etests\\PageObject\\OrderFoodPage.js:51:21)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:29:15)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\nFrom: Task: Run it(\"Save a restaurant in restaurant page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:26:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22r24z8ol28ew6mhhsoce2ctbrd1538985570513%22%2C%22sessionId%22%3A%22p0kva3o7y35rj7ga31rv3wp151538985570513%22%2C%22sessionStartDateTime%22%3A%222018-10-08T07%3A59%3A30.513Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T07%3A59%3A30.878Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2215f387d0-cad0-11e8-9355-57f0df714eb9%22%2C%22v2SessionId%22%3A%2215f3aee1-cad0-11e8-a085-0511c02c8840%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538985572472,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538985575738,
                "type": ""
            }
        ],
        "screenShotFile": "00b60090-0003-0060-0040-0096004a00a6.png",
        "timestamp": 1538985564050,
        "duration": 11742
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "96d04d44f58861a9de2cf8d10c8ce821",
        "instanceId": 5060,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Cannot read property 'bind' of undefined"
        ],
        "trace": [
            "TypeError: Cannot read property 'bind' of undefined\n    at ProtractorExpectedConditions.presenceOf (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\expectedConditions.js:341:40)\n    at ProtractorExpectedConditions.visibilityOf (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\expectedConditions.js:381:30)\n    at Restaurant.findfoodatlocation (D:\\e2etests\\PageObject\\OrderFoodPage.js:51:21)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:43:15)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00d00066-0064-0028-0020-003c00bb00a6.png",
        "timestamp": 1538985576477,
        "duration": 2863
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "79aafc3ae04e0dc831416a3120936e28",
        "instanceId": 6032,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22jo8hy48lmzl7y4axxu2vdx5gu1538986829916%22%2C%22sessionId%22%3A%22diedzsunuztxo8wxpounnrhu11538986829915%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A20%3A29.915Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T08%3A20%3A31.175Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22049d0676-cad3-11e8-97ed-91ec283eb0f8%22%2C%22v2SessionId%22%3A%22049d2d88-cad3-11e8-bbba-3de5159a1b35%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538986832485,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538986837365,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538986839175,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538986849820,
                "type": ""
            }
        ],
        "screenShotFile": "0014000d-00ed-001c-0000-007300570062.png",
        "timestamp": 1538986822841,
        "duration": 41587
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "79aafc3ae04e0dc831416a3120936e28",
        "instanceId": 6032,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //ghs-restaurant-section-data[1]/div[1]/div[1]/div[1]/div[1]/ghs-restaurant-carousel[1]/div[1]/ghs-in-view[1]/ghs-carousel[1]/div[1]/div[3]/div[1]/ghs-restaurant-carousel-item[1]/div[1]/div[1]/div[2]/ghs-favorite-this[1]/button[1])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //ghs-restaurant-section-data[1]/div[1]/div[1]/div[1]/div[1]/ghs-restaurant-carousel[1]/div[1]/ghs-in-view[1]/ghs-carousel[1]/div[1]/div[3]/div[1]/ghs-restaurant-carousel-item[1]/div[1]/div[1]/div[2]/ghs-favorite-this[1]/button[1])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Saved.savepopularestaurant (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:27:22)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:46:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22jo8hy48lmzl7y4axxu2vdx5gu1538986829916%22%2C%22sessionId%22%3A%22diedzsunuztxo8wxpounnrhu11538986829915%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A20%3A29.915Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A4%2C%22dateTime%22%3A%222018-10-08T08%3A21%3A09.699Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22049d0676-cad3-11e8-97ed-91ec283eb0f8%22%2C%22v2SessionId%22%3A%22049d2d88-cad3-11e8-bbba-3de5159a1b35%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538986870067,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538986879441,
                "type": ""
            }
        ],
        "screenShotFile": "00e0009d-00d1-002e-003a-0068007500a1.png",
        "timestamp": 1538986866798,
        "duration": 16494
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "f58a1f9e0d90a1b9e8ea76b92dc4e555",
        "instanceId": 7784,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ikgsht7gwnu3198fq1u94dip41538987007917%22%2C%22sessionId%22%3A%22npyd2cnrge0uavh80uj665jxi1538987007917%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A23%3A27.917Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T08%3A23%3A28.710Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%226eb5d28c-cad3-11e8-b979-e95d04529c86%22%2C%22v2SessionId%22%3A%226eb5f990-cad3-11e8-a9df-e9e6e7ade1b3%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538987010513,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538987015022,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538987016520,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538987027375,
                "type": ""
            }
        ],
        "screenShotFile": "008e0054-00ce-0001-0050-00b0004b0043.png",
        "timestamp": 1538987001030,
        "duration": 42709
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "f58a1f9e0d90a1b9e8ea76b92dc4e555",
        "instanceId": 7784,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //ghs-restaurant-section-data[1]/div[1]/div[1]/div[1]/div[1]/ghs-restaurant-carousel[1]/div[1]/ghs-in-view[1]/ghs-carousel[1]/div[1]/div[3]/div[1]/ghs-restaurant-carousel-item[1]/div[1]/div[1]/div[2]/ghs-favorite-this[1]/button[1]/div[1]/cb-icon[1]/*)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //ghs-restaurant-section-data[1]/div[1]/div[1]/div[1]/div[1]/ghs-restaurant-carousel[1]/div[1]/ghs-in-view[1]/ghs-carousel[1]/div[1]/div[3]/div[1]/ghs-restaurant-carousel-item[1]/div[1]/div[1]/div[2]/ghs-favorite-this[1]/button[1]/div[1]/cb-icon[1]/*)\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Saved.savepopularestaurant (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:27:22)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:46:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ikgsht7gwnu3198fq1u94dip41538987007917%22%2C%22sessionId%22%3A%22npyd2cnrge0uavh80uj665jxi1538987007917%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A23%3A27.917Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T08%3A24%3A08.736Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%226eb5d28c-cad3-11e8-b979-e95d04529c86%22%2C%22v2SessionId%22%3A%226eb5f990-cad3-11e8-a9df-e9e6e7ade1b3%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538987049387,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538987059944,
                "type": ""
            }
        ],
        "screenShotFile": "002a0044-004f-00bf-00b3-000a00b4002c.png",
        "timestamp": 1538987045693,
        "duration": 17740
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "68c066902dde1abb06dabae473e7f797",
        "instanceId": 5920,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%220u778xm972h9c5vptcx9ppyyb1538987172094%22%2C%22sessionId%22%3A%22w0djln0ua0atx1my6b2z76v0z1538987172094%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A26%3A12.094Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-08T08%3A26%3A13.083Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22d09165a5-cad3-11e8-815f-378526086734%22%2C%22v2SessionId%22%3A%22d0918cb5-cad3-11e8-82c0-3fd080276d9d%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538987174123,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538987183833,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538987184456,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538987195705,
                "type": ""
            }
        ],
        "screenShotFile": "007800b5-00bb-00b7-0089-001800f000d2.png",
        "timestamp": 1538987164187,
        "duration": 48271
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "68c066902dde1abb06dabae473e7f797",
        "instanceId": 5920,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //ghs-restaurant-section-data[1]/div[1]/div[1]/div[1]/div[1]/ghs-restaurant-carousel[1]/div[1]/ghs-in-view[1]/ghs-carousel[1]/div[1]/div[3]/div[1]/ghs-restaurant-carousel-item[1]/div[1]/div[1]/div[2]/ghs-favorite-this[1]/button[1]/div[1]/cb-icon[1]/*)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //ghs-restaurant-section-data[1]/div[1]/div[1]/div[1]/div[1]/ghs-restaurant-carousel[1]/div[1]/ghs-in-view[1]/ghs-carousel[1]/div[1]/div[3]/div[1]/ghs-restaurant-carousel-item[1]/div[1]/div[1]/div[2]/ghs-favorite-this[1]/button[1]/div[1]/cb-icon[1]/*)\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Saved.savepopularestaurant (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:27:22)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:47:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%220u778xm972h9c5vptcx9ppyyb1538987172094%22%2C%22sessionId%22%3A%22w0djln0ua0atx1my6b2z76v0z1538987172094%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A26%3A12.094Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T08%3A26%3A57.014Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22d09165a5-cad3-11e8-815f-378526086734%22%2C%22v2SessionId%22%3A%22d0918cb5-cad3-11e8-82c0-3fd080276d9d%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538987217389,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538987227046,
                "type": ""
            }
        ],
        "screenShotFile": "006e00be-00c4-004d-00de-0089001000da.png",
        "timestamp": 1538987214020,
        "duration": 19275
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "57926a7e2f2b67feadf51413eadaef2b",
        "instanceId": 7000,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%223rrybg4ssxudzbwh2na01zf8k1538987377220%22%2C%22sessionId%22%3A%227k395qcaayj51i0ms44s9rsol1538987377219%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A29%3A37.219Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T08%3A29%3A38.208Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%224ad5240d-cad4-11e8-bd51-0d1973eaf263%22%2C%22v2SessionId%22%3A%224ad54b19-cad4-11e8-b79f-85bb1861191d%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538987381276,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538987384783,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538987386348,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538987396459,
                "type": ""
            }
        ],
        "screenShotFile": "008500bb-00dc-0069-0056-00d400f50047.png",
        "timestamp": 1538987370169,
        "duration": 41274
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "57926a7e2f2b67feadf51413eadaef2b",
        "instanceId": 7000,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //ghs-restaurant-section-data[1]/div[1]/div[1]/div[1]/div[1]/ghs-restaurant-carousel[1]/div[1]/ghs-in-view[1]/ghs-carousel[1]/div[1]/div[3]/div[1]/ghs-restaurant-carousel-item[1]/div[1]/div[1]/div[2]/ghs-favorite-this[1]/button[1]/div[1]/cb-icon[1]/*)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //ghs-restaurant-section-data[1]/div[1]/div[1]/div[1]/div[1]/ghs-restaurant-carousel[1]/div[1]/ghs-in-view[1]/ghs-carousel[1]/div[1]/div[3]/div[1]/ghs-restaurant-carousel-item[1]/div[1]/div[1]/div[2]/ghs-favorite-this[1]/button[1]/div[1]/cb-icon[1]/*)\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: WebDriver.executeScript()\n    at thenableWebDriverProxy.schedule (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at thenableWebDriverProxy.executeScript (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as executeScript] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Saved.savepopularestaurant (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:27:13)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:47:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%223rrybg4ssxudzbwh2na01zf8k1538987377220%22%2C%22sessionId%22%3A%227k395qcaayj51i0ms44s9rsol1538987377219%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A29%3A37.219Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T08%3A30%3A16.134Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%224ad5240d-cad4-11e8-bd51-0d1973eaf263%22%2C%22v2SessionId%22%3A%224ad54b19-cad4-11e8-b79f-85bb1861191d%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538987416493,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538987426645,
                "type": ""
            }
        ],
        "screenShotFile": "000f0077-004f-008f-00fa-00ca004a001e.png",
        "timestamp": 1538987413111,
        "duration": 18252
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "754148c0b288cb4fecac0076134c2f78",
        "instanceId": 8376,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22hsr9lho5f3q2vzjgqo46cx14a1538987567652%22%2C%22sessionId%22%3A%22gxlym3hrf9dozegyshxarr9nd1538987567651%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A32%3A47.651Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T08%3A32%3A48.667Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22bc5625cb-cad4-11e8-a4db-3579041ae235%22%2C%22v2SessionId%22%3A%22bc5673ee-cad4-11e8-b9f7-4f46860886d5%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538987569803,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538987574199,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538987575645,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538987586498,
                "type": ""
            }
        ],
        "screenShotFile": "00e000fe-0085-00d6-00d8-00e3002f0088.png",
        "timestamp": 1538987560752,
        "duration": 40707
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "754148c0b288cb4fecac0076134c2f78",
        "instanceId": 8376,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: EC is not defined"
        ],
        "trace": [
            "ReferenceError: EC is not defined\n    at Saved.savepopularestaurant (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:28:18)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:47:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22hsr9lho5f3q2vzjgqo46cx14a1538987567652%22%2C%22sessionId%22%3A%22gxlym3hrf9dozegyshxarr9nd1538987567651%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A32%3A47.651Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T08%3A33%3A26.494Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22bc5625cb-cad4-11e8-a4db-3579041ae235%22%2C%22v2SessionId%22%3A%22bc5673ee-cad4-11e8-b9f7-4f46860886d5%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538987606831,
                "type": ""
            }
        ],
        "screenShotFile": "000f008a-0054-0058-0027-009a002d001e.png",
        "timestamp": 1538987603449,
        "duration": 4195
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "1364657bd056a4a17bf01976c2f1b2aa",
        "instanceId": 2856,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a.ghs-goToCreateAccount)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a.ghs-goToCreateAccount)\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Register.createyouraccount (D:\\e2etests\\PageObject\\SignUpPage.js:74:19)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:28:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Save a restaurant in restaurant page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:26:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%223dscrnzwvm8a6rkle4jom0ul71538987679257%22%2C%22sessionId%22%3A%22ypu8cyfq9qprrma2ofubhc1m21538987679257%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A34%3A39.257Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T08%3A34%3A40.392Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22fedc5450-cad4-11e8-9deb-9116d704415f%22%2C%22v2SessionId%22%3A%22fedc7b6c-cad4-11e8-a426-596647cb4caa%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538987681938,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538987687602,
                "type": ""
            }
        ],
        "screenShotFile": "0014009a-005a-001a-0011-00b6008e0077.png",
        "timestamp": 1538987672680,
        "duration": 15294
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "1364657bd056a4a17bf01976c2f1b2aa",
        "instanceId": 2856,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Wait timed out after 10002ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 10002ms\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Saved.savepopularestaurant (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:32:13)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:47:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538987695790,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538987704148,
                "type": ""
            }
        ],
        "screenShotFile": "009a0002-0018-0058-0081-00f90098004f.png",
        "timestamp": 1538987688764,
        "duration": 29839
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "66249bbe1ebae86e118b8a2b4f2168d8",
        "instanceId": 5708,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22235dejko1ejwc8pr3fxdhkpn61538987745555%22%2C%22sessionId%22%3A%22pgk0hy6avzhncqws2otgi476t1538987745553%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A35%3A45.553Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T08%3A35%3A46.968Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22265f6171-cad5-11e8-99a8-f119dd8b3fab%22%2C%22v2SessionId%22%3A%22265fd6a4-cad5-11e8-b7e4-d1e58e83bfdc%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538987747643,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538987753092,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538987754589,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538987765008,
                "type": ""
            }
        ],
        "screenShotFile": "0089004f-000c-002d-00a8-004f000700a4.png",
        "timestamp": 1538987738460,
        "duration": 42252
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "66249bbe1ebae86e118b8a2b4f2168d8",
        "instanceId": 5708,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: unknown error: Element <svg _ngcontent-c1=\"\" aria-hidden=\"true\" class=\"cb-icon cb-icon-svg cb-icon--sm\">...</svg> is not clickable at point (340, 12). Other element would receive the click: <div class=\"mainNavCol mainNavSearch\">...</div>\n  (Session info: chrome=69.0.3497.100)\n  (Driver info: chromedriver=2.42.591088 (7b2b2dca23cca0862f674758c9a3933e685c27d5),platform=Windows NT 6.1.7601 SP1 x86_64)"
        ],
        "trace": [
            "WebDriverError: unknown error: Element <svg _ngcontent-c1=\"\" aria-hidden=\"true\" class=\"cb-icon cb-icon-svg cb-icon--sm\">...</svg> is not clickable at point (340, 12). Other element would receive the click: <div class=\"mainNavCol mainNavSearch\">...</div>\n  (Session info: chrome=69.0.3497.100)\n  (Driver info: chromedriver=2.42.591088 (7b2b2dca23cca0862f674758c9a3933e685c27d5),platform=Windows NT 6.1.7601 SP1 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: WebElement.click()\n    at thenableWebDriverProxy.schedule (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at WebElement.schedule_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:2010:25)\n    at WebElement.click (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:2092:17)\n    at actionFn (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:89:44)\n    at Array.map (<anonymous>)\n    at actionResults.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:461:65)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Saved.savepopularestaurant (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:33:22)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:47:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22235dejko1ejwc8pr3fxdhkpn61538987745555%22%2C%22sessionId%22%3A%22pgk0hy6avzhncqws2otgi476t1538987745553%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A35%3A45.553Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T08%3A36%3A25.253Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22265f6171-cad5-11e8-99a8-f119dd8b3fab%22%2C%22v2SessionId%22%3A%22265fd6a4-cad5-11e8-b7e4-d1e58e83bfdc%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538987785647,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538987795556,
                "type": ""
            }
        ],
        "screenShotFile": "001500f7-0011-002a-00f4-004f00cf0073.png",
        "timestamp": 1538987782349,
        "duration": 20742
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "f4e593c1e40219ef23a954f70fbb6c24",
        "instanceId": 6480,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22kjyd1dmky5z2o8531k747eqqy1538988107006%22%2C%22sessionId%22%3A%22abqjoz2gipuygi90gi9jka6er1538988107005%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A41%3A47.005Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T08%3A41%3A48.129Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22fdd10965-cad5-11e8-8a2a-27310b39ce98%22%2C%22v2SessionId%22%3A%22fdd15783-cad5-11e8-90fa-73d619e93c5a%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538988108808,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538988113818,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538988115097,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538988125543,
                "type": ""
            }
        ],
        "screenShotFile": "00840001-0022-0031-00af-00f6001500fb.png",
        "timestamp": 1538988100335,
        "duration": 39436
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "f4e593c1e40219ef23a954f70fbb6c24",
        "instanceId": 6480,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //ghs-restaurant-section-data[1]/div[1]/div[1]/div[1]/div[1]/ghs-restaurant-carousel[1]/div[1]/ghs-in-view[1]/ghs-carousel[1]/div[1]/div[3]/div[1]/ghs-restaurant-carousel-item[1]/div[1]/div[1]/div[2]/ghs-favorite-this[1]/button[1]/div[1]/cb-icon[1]/*)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //ghs-restaurant-section-data[1]/div[1]/div[1]/div[1]/div[1]/ghs-restaurant-carousel[1]/div[1]/ghs-in-view[1]/ghs-carousel[1]/div[1]/div[3]/div[1]/ghs-restaurant-carousel-item[1]/div[1]/div[1]/div[2]/ghs-favorite-this[1]/button[1]/div[1]/cb-icon[1]/*)\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: WebDriver.executeScript()\n    at thenableWebDriverProxy.schedule (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at thenableWebDriverProxy.executeScript (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as executeScript] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Saved.savepopularestaurant (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:31:13)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:47:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22kjyd1dmky5z2o8531k747eqqy1538988107006%22%2C%22sessionId%22%3A%22abqjoz2gipuygi90gi9jka6er1538988107005%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A41%3A47.005Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T08%3A42%3A24.595Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22fdd10965-cad5-11e8-8a2a-27310b39ce98%22%2C%22v2SessionId%22%3A%22fdd15783-cad5-11e8-90fa-73d619e93c5a%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538988145243,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538988154843,
                "type": ""
            }
        ],
        "screenShotFile": "00e900a3-0018-00c5-00d9-009d003100f9.png",
        "timestamp": 1538988141490,
        "duration": 17503
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "bda7774e5bf6006f4f885775aabebc38",
        "instanceId": 8556,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a.ghs-goToCreateAccount)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a.ghs-goToCreateAccount)\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Register.createyouraccount (D:\\e2etests\\PageObject\\SignUpPage.js:74:19)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:28:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Save a restaurant in restaurant page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:26:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22br8ifopawon0hus6hct280ob01538988188644%22%2C%22sessionId%22%3A%2234s1nt60e6hm27t4qquvp98cz1538988188643%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A43%3A08.642Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-08T08%3A43%3A09.134Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%222e79b3a7-cad6-11e8-936f-d1e6bf3ea9bf%22%2C%22v2SessionId%22%3A%222e7a28db-cad6-11e8-a88c-71299471293d%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538988191030,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538988196919,
                "type": ""
            }
        ],
        "screenShotFile": "00cb00db-0036-0073-00fd-00a3006b0062.png",
        "timestamp": 1538988182368,
        "duration": 14920
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "c0f93a044baaf2e05ec62e1cf501ae3d",
        "instanceId": 7380,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22z5zd62lftk0r5awo6df3w45h81538988286974%22%2C%22sessionId%22%3A%22cy96h6oj05zmatbnac1kudi431538988286972%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A44%3A46.971Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-08T08%3A44%3A47.524Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2269153615-cad6-11e8-b8ad-f7ab336baa2a%22%2C%22v2SessionId%22%3A%226915d25a-cad6-11e8-b31a-f90950648276%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538988289387,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538988294553,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538988295878,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538988306805,
                "type": ""
            }
        ],
        "screenShotFile": "004b00d3-0081-0011-006c-003700940024.png",
        "timestamp": 1538988280641,
        "duration": 41177
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "c0f93a044baaf2e05ec62e1cf501ae3d",
        "instanceId": 7380,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //ghs-restaurant-section-data[1]/div[1]/div[1]/div[1]/div[1]/ghs-restaurant-carousel[1]/div[1]/ghs-in-view[1]/ghs-carousel[1]/div[1]/div[3]/div[1]/ghs-restaurant-carousel-item[1]/div[1]/div[1]/div[2]/ghs-favorite-this[1]/button[1]/div[1]/cb-icon[1])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //ghs-restaurant-section-data[1]/div[1]/div[1]/div[1]/div[1]/ghs-restaurant-carousel[1]/div[1]/ghs-in-view[1]/ghs-carousel[1]/div[1]/div[3]/div[1]/ghs-restaurant-carousel-item[1]/div[1]/div[1]/div[2]/ghs-favorite-this[1]/button[1]/div[1]/cb-icon[1])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: WebDriver.executeScript()\n    at thenableWebDriverProxy.schedule (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at thenableWebDriverProxy.executeScript (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:878:16)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as executeScript] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Saved.savepopularestaurant (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:31:13)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:47:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22z5zd62lftk0r5awo6df3w45h81538988286974%22%2C%22sessionId%22%3A%22cy96h6oj05zmatbnac1kudi431538988286972%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A44%3A46.971Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T08%3A45%3A26.546Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2269153615-cad6-11e8-b8ad-f7ab336baa2a%22%2C%22v2SessionId%22%3A%226915d25a-cad6-11e8-b31a-f90950648276%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538988326918,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538988337193,
                "type": ""
            }
        ],
        "screenShotFile": "00cb0095-00fb-004c-005d-000800100066.png",
        "timestamp": 1538988323408,
        "duration": 18829
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "eee0a49b9d37135d5da539988e153398",
        "instanceId": 4896,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%224kqrekwwjdkd0baytbvh1wabz1538989118957%22%2C%22sessionId%22%3A%2223s3mghhd827hv8yqnqt69qen1538989118956%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A58%3A38.956Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T08%3A58%3A39.661Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2258fcf684-cad8-11e8-ac39-a36fccafed61%22%2C%22v2SessionId%22%3A%2258fd44ad-cad8-11e8-afac-e5565d14c15c%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538989121165,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538989126479,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538989127793,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538989138367,
                "type": ""
            }
        ],
        "screenShotFile": "008c0028-00cb-0081-0069-007b00e90016.png",
        "timestamp": 1538989112402,
        "duration": 41124
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "eee0a49b9d37135d5da539988e153398",
        "instanceId": 4896,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: allsavedIconPopular.each is not a function"
        ],
        "trace": [
            "TypeError: allsavedIconPopular.each is not a function\n    at Saved.savepopularestaurant (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:35:25)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:47:15)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%224kqrekwwjdkd0baytbvh1wabz1538989118957%22%2C%22sessionId%22%3A%2223s3mghhd827hv8yqnqt69qen1538989118956%22%2C%22sessionStartDateTime%22%3A%222018-10-08T08%3A58%3A38.956Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T08%3A59%3A19.182Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2258fcf684-cad8-11e8-ac39-a36fccafed61%22%2C%22v2SessionId%22%3A%2258fd44ad-cad8-11e8-afac-e5565d14c15c%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538989159745,
                "type": ""
            }
        ],
        "screenShotFile": "0053008b-0017-007d-002a-003d0073004b.png",
        "timestamp": 1538989155641,
        "duration": 4521
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "60f85f7425841b31f8f62b98330c2002",
        "instanceId": 7488,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%223hkjtpf33oludzxv08449qqvc1538989222466%22%2C%22sessionId%22%3A%22q10wyjzsopbu9jpub04qavbsa1538989222465%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A00%3A22.465Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T09%3A00%3A23.518Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2296af07ce-cad8-11e8-8a15-3bcf8a2f17ac%22%2C%22v2SessionId%22%3A%2296af2edd-cad8-11e8-b216-0fe9d6660287%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538989224810,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538989229758,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538989231094,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538989241324,
                "type": ""
            }
        ],
        "screenShotFile": "006100b0-002d-00c1-0077-004e00e40025.png",
        "timestamp": 1538989216207,
        "duration": 40643
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "60f85f7425841b31f8f62b98330c2002",
        "instanceId": 7488,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%223hkjtpf33oludzxv08449qqvc1538989222466%22%2C%22sessionId%22%3A%22q10wyjzsopbu9jpub04qavbsa1538989222465%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A00%3A22.465Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T09%3A01%3A01.984Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2296af07ce-cad8-11e8-8a15-3bcf8a2f17ac%22%2C%22v2SessionId%22%3A%2296af2edd-cad8-11e8-b216-0fe9d6660287%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538989262304,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538989271860,
                "type": ""
            }
        ],
        "screenShotFile": "00a40009-007f-007a-005b-003500b8008a.png",
        "timestamp": 1538989258970,
        "duration": 16784
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "65f3b05046474e5e5f2527d13dd4948b",
        "instanceId": 5400,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%2295jnorvzsuqtosshbcb4n7g8k1538990530633%22%2C%22sessionId%22%3A%22njwhvdlnfq4vfhq5086fc1xjh1538990530630%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A22%3A10.629Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T09%3A22%3A11.307Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22a2688eda-cadb-11e8-8ffd-b30d36fb1e58%22%2C%22v2SessionId%22%3A%22a268dcf6-cadb-11e8-a3ba-4995c4caa9ac%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538990533440,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538990540467,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538990541144,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538990562291,
                "type": ""
            }
        ],
        "screenShotFile": "00cb00e0-00cf-0090-00fd-0046006c00cb.png",
        "timestamp": 1538990519277,
        "duration": 59934
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "65f3b05046474e5e5f2527d13dd4948b",
        "instanceId": 5400,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: allsavedIconPopular is not defined"
        ],
        "trace": [
            "ReferenceError: allsavedIconPopular is not defined\n    at Saved.savepopularestaurant (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:32:5)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:47:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%2295jnorvzsuqtosshbcb4n7g8k1538990530633%22%2C%22sessionId%22%3A%22njwhvdlnfq4vfhq5086fc1xjh1538990530630%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A22%3A10.629Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T09%3A23%3A04.072Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22a2688eda-cadb-11e8-8ffd-b30d36fb1e58%22%2C%22v2SessionId%22%3A%22a268dcf6-cadb-11e8-a3ba-4995c4caa9ac%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538990584423,
                "type": ""
            }
        ],
        "screenShotFile": "00ed00ef-001b-00fb-00d4-005500e400b0.png",
        "timestamp": 1538990581022,
        "duration": 4206
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "08897fbe2158feade3c981b600d7c53f",
        "instanceId": 7680,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22nt814ktbb1mo6w9heh25yu4yw1538990661947%22%2C%22sessionId%22%3A%22oglaxlkj1mlr7udnt76u1zdlu1538990661944%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A24%3A21.944Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T09%3A24%3A22.949Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22f0ac919f-cadb-11e8-93ae-1162acd20997%22%2C%22v2SessionId%22%3A%22f0ad7bff-cadb-11e8-b4bd-51a1f894814c%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538990664215,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538990669879,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538990671314,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538990683430,
                "type": ""
            }
        ],
        "screenShotFile": "00e8009a-002f-00a5-00f9-00250065007f.png",
        "timestamp": 1538990655473,
        "duration": 42379
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "08897fbe2158feade3c981b600d7c53f",
        "instanceId": 7680,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected [  ] to be [  ]."
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:51:23)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22nt814ktbb1mo6w9heh25yu4yw1538990661947%22%2C%22sessionId%22%3A%22oglaxlkj1mlr7udnt76u1zdlu1538990661944%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A24%3A21.944Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T09%3A25%3A02.550Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22f0ac919f-cadb-11e8-93ae-1162acd20997%22%2C%22v2SessionId%22%3A%22f0ad7bff-cadb-11e8-b4bd-51a1f894814c%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538990702913,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538990712626,
                "type": ""
            }
        ],
        "screenShotFile": "006300ec-0075-005c-00cb-007700aa0087.png",
        "timestamp": 1538990699567,
        "duration": 20878
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "66688437bb09ee72dba376d4aea0ae35",
        "instanceId": 4512,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22b0lmphw6it32h0f1n9sg81n781538991523357%22%2C%22sessionId%22%3A%22n1xyycsqpt14eoz3dtio2rheb1538991523356%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A38%3A43.356Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-08T09%3A38%3A44.225Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22f21f709b-cadd-11e8-912d-09086569818c%22%2C%22v2SessionId%22%3A%22f21f7095-cadd-11e8-a3d7-47dc07447910%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538991525148,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538991531091,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538991532690,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538991542910,
                "type": ""
            }
        ],
        "screenShotFile": "00bd006c-00f5-00b0-00dc-008d003b00cc.png",
        "timestamp": 1538991516928,
        "duration": 39617
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "66688437bb09ee72dba376d4aea0ae35",
        "instanceId": 4512,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: allsavedpageresturantname is not defined"
        ],
        "trace": [
            "ReferenceError: allsavedpageresturantname is not defined\n    at Saved.savepopularestaurant (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:36:9)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:47:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22b0lmphw6it32h0f1n9sg81n781538991523357%22%2C%22sessionId%22%3A%22n1xyycsqpt14eoz3dtio2rheb1538991523356%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A38%3A43.356Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T09%3A39%3A20.917Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22f21f709b-cadd-11e8-912d-09086569818c%22%2C%22v2SessionId%22%3A%22f21f7095-cadd-11e8-a3d7-47dc07447910%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538991561241,
                "type": ""
            }
        ],
        "screenShotFile": "00fa00b1-0066-00b9-00b7-008100d80092.png",
        "timestamp": 1538991558097,
        "duration": 4003
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "d644d16a85d535477cf357da88e9c59e",
        "instanceId": 8692,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22v9kowbn0s5a559rd71taox1rv1538991669449%22%2C%22sessionId%22%3A%223c3e12km0u1bvcdrw8z8jlro31538991669448%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A41%3A09.448Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T09%3A41%3A10.300Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%224933284a-cade-11e8-8d04-310806231092%22%2C%22v2SessionId%22%3A%2249337669-cade-11e8-b019-0f8be876e1b1%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538991671352,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538991682066,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538991682684,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538991692604,
                "type": ""
            }
        ],
        "screenShotFile": "002a0008-00c3-00a7-00da-0054003c00b5.png",
        "timestamp": 1538991663083,
        "duration": 42978
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "d644d16a85d535477cf357da88e9c59e",
        "instanceId": 8692,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected [  ] to be [  ].",
            "Failed: nameh.count is not a function"
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:51:23)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7",
            "TypeError: nameh.count is not a function\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:52:22)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22v9kowbn0s5a559rd71taox1rv1538991669449%22%2C%22sessionId%22%3A%223c3e12km0u1bvcdrw8z8jlro31538991669448%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A41%3A09.448Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T09%3A41%3A50.637Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%224933284a-cade-11e8-8d04-310806231092%22%2C%22v2SessionId%22%3A%2249337669-cade-11e8-b019-0f8be876e1b1%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538991710981,
                "type": ""
            }
        ],
        "screenShotFile": "002e007d-00bb-0000-005d-001f006a00df.png",
        "timestamp": 1538991707770,
        "duration": 3926
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "4a94f27727c4fd2498575d7b2940c786",
        "instanceId": 8500,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22auf4y03zm4u0e935228jax8aq1538991990668%22%2C%22sessionId%22%3A%22rg1zeav650ebbldqx23f88t911538991990667%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A46%3A30.667Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-08T09%3A46%3A31.533Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2208a94974-cadf-11e8-93b9-6d10e61ffdbf%22%2C%22v2SessionId%22%3A%2208a94978-cadf-11e8-bfa9-a36e4fb50c8f%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538991992687,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538991998003,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538991999424,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538992008714,
                "type": ""
            }
        ],
        "screenShotFile": "00870096-003b-0090-003d-00fe009700e4.png",
        "timestamp": 1538991983611,
        "duration": 38051
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "4a94f27727c4fd2498575d7b2940c786",
        "instanceId": 8500,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected [  ] to be [  ].",
            "Failed: nameh.count is not a function"
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:51:23)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7",
            "TypeError: nameh.count is not a function\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:52:22)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22auf4y03zm4u0e935228jax8aq1538991990668%22%2C%22sessionId%22%3A%22rg1zeav650ebbldqx23f88t911538991990667%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A46%3A30.667Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T09%3A47%3A06.008Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2208a94974-cadf-11e8-93b9-6d10e61ffdbf%22%2C%22v2SessionId%22%3A%2208a94978-cadf-11e8-bfa9-a36e4fb50c8f%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538992026731,
                "type": ""
            }
        ],
        "screenShotFile": "00a9003a-00c7-00b1-00e9-00e900d50095.png",
        "timestamp": 1538992023190,
        "duration": 4258
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "c6f44dd75656ace475a3ac753344fc77",
        "instanceId": 7392,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22f9jakqq12of4y86jbpuj5kuyz1538992227850%22%2C%22sessionId%22%3A%22n4zbniv12au6b7uymsp40gall1538992227850%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A50%3A27.849Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-08T09%3A50%3A28.497Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2296088a6b-cadf-11e8-a560-f36ad19a1e16%22%2C%22v2SessionId%22%3A%229608d884-cadf-11e8-9ecd-61c345fbc486%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538992229769,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538992233357,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538992234558,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538992244641,
                "type": ""
            }
        ],
        "screenShotFile": "00e0007f-00f0-0049-003f-001500d10009.png",
        "timestamp": 1538992221456,
        "duration": 39637
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "c6f44dd75656ace475a3ac753344fc77",
        "instanceId": 7392,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected [  ] to be [  ].",
            "Failed: nameh.count is not a function"
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:51:23)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7",
            "TypeError: nameh.count is not a function\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:52:22)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "006e0023-0013-00d8-0051-00b20071004a.png",
        "timestamp": 1538992263600,
        "duration": 3909
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "59f27a3e86c02055522c544cf22a5e7a",
        "instanceId": 7508,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22b78a3udhlxcy7l7bxlhxn0kv41538992706674%22%2C%22sessionId%22%3A%2212xc3163o97zqm2liri0rcux51538992706673%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A58%3A26.673Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T09%3A58%3A27.560Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22b36ed3bb-cae0-11e8-a9f2-c1c8414a2297%22%2C%22v2SessionId%22%3A%22b36f21d8-cae0-11e8-96b5-41d5f35e9b0d%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538992708586,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538992713527,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538992714745,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538992724313,
                "type": ""
            }
        ],
        "screenShotFile": "00a2000a-0016-0043-0000-007e008900ab.png",
        "timestamp": 1538992700384,
        "duration": 37227
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "59f27a3e86c02055522c544cf22a5e7a",
        "instanceId": 7508,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected [  ] to be [  ].",
            "Failed: nameh.count is not a function"
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:51:23)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7",
            "TypeError: nameh.count is not a function\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:52:22)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22b78a3udhlxcy7l7bxlhxn0kv41538992706674%22%2C%22sessionId%22%3A%2212xc3163o97zqm2liri0rcux51538992706673%22%2C%22sessionStartDateTime%22%3A%222018-10-08T09%3A58%3A26.673Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T09%3A59%3A01.872Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22b36ed3bb-cae0-11e8-a9f2-c1c8414a2297%22%2C%22v2SessionId%22%3A%22b36f21d8-cae0-11e8-96b5-41d5f35e9b0d%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538992742542,
                "type": ""
            }
        ],
        "screenShotFile": "00860010-0080-0078-00d7-00a5004300ab.png",
        "timestamp": 1538992739227,
        "duration": 4161
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ba2fb4377de9cc5b2f8c3ae56989764b",
        "instanceId": 8732,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22l6o37c06s33ae0zu5qih0wwer1538993092301%22%2C%22sessionId%22%3A%22z8nf0p6ooaziw9upr5bsvd0oi1538993092300%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A04%3A52.300Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A04%3A53.457Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2299492488-cae1-11e8-8974-5b8c6b2f0ebc%22%2C%22v2SessionId%22%3A%2299494b94-cae1-11e8-ac55-3706ea3214ed%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538993094754,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538993097776,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538993099122,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538993108879,
                "type": ""
            }
        ],
        "screenShotFile": "00e300a8-00c3-0025-005b-00100001003f.png",
        "timestamp": 1538993085455,
        "duration": 36838
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ba2fb4377de9cc5b2f8c3ae56989764b",
        "instanceId": 8732,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected [  ] to be [  ].",
            "Failed: nameh.count is not a function"
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:51:23)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7",
            "TypeError: nameh.count is not a function\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:52:22)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22l6o37c06s33ae0zu5qih0wwer1538993092301%22%2C%22sessionId%22%3A%22z8nf0p6ooaziw9upr5bsvd0oi1538993092300%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A04%3A52.300Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T10%3A05%3A26.669Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2299492488-cae1-11e8-8974-5b8c6b2f0ebc%22%2C%22v2SessionId%22%3A%2299494b94-cae1-11e8-ac55-3706ea3214ed%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538993127013,
                "type": ""
            }
        ],
        "screenShotFile": "005a00d9-001f-00eb-0087-00a400f800bd.png",
        "timestamp": 1538993123787,
        "duration": 3931
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "617534d1d413a21d26c468fc5219a5eb",
        "instanceId": 6708,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected [  ] to be [  ].",
            "Failed: nameh.count is not a function"
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:51:23)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7",
            "TypeError: nameh.count is not a function\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:52:22)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%2235cjuaqpqrnyiteavimae1lj51538993442701%22%2C%22sessionId%22%3A%22hslohlfmub46gm7zs0cha8ytp1538993442701%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A10%3A42.700Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A10%3A43.898Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%226a24179e-cae2-11e8-95a5-f7caf1573173%22%2C%22v2SessionId%22%3A%226a2465b3-cae2-11e8-aec5-798332b0b4f7%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538993445005,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538993449545,
                "type": ""
            }
        ],
        "screenShotFile": "005d0022-007e-008e-00bc-00bb003b0072.png",
        "timestamp": 1538993436115,
        "duration": 13497
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6fcc3714c7f4fd0f7055edc7a8b87c43",
        "instanceId": 7264,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: nameh.lenght is not a function"
        ],
        "trace": [
            "TypeError: nameh.lenght is not a function\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:52:22)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22eyw9q8uyrl5c3o4l9csdj2ocd1538993541382%22%2C%22sessionId%22%3A%22e2yr63p54q0qpds1cfwjy5zci1538993541379%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A12%3A21.378Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A12%3A22.567Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22a4f4dad8-cae2-11e8-b24a-cdb7f38dbaed%22%2C%22v2SessionId%22%3A%22a4f528f3-cae2-11e8-ba08-4b846778cad0%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538993543472,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538993547846,
                "type": ""
            }
        ],
        "screenShotFile": "00920092-004f-00e2-00d6-00b600c100b5.png",
        "timestamp": 1538993535179,
        "duration": 12718
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "1e59fc991164c2a581f3411ff9d130ee",
        "instanceId": 6668,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: nameh.length is not a function"
        ],
        "trace": [
            "TypeError: nameh.length is not a function\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:52:22)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22bgq9n77ion4ey1odqgg524ylb1538993569949%22%2C%22sessionId%22%3A%220hq7zitr311mchg4n3pczwpj71538993569948%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A12%3A49.948Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A12%3A50.734Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22b5fc989b-cae2-11e8-9689-8bbf8c449980%22%2C%22v2SessionId%22%3A%22b5fcbfab-cae2-11e8-923a-31fffaa98b84%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538993571628,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538993576582,
                "type": ""
            }
        ],
        "screenShotFile": "00c500d8-00c8-0033-00a1-0029002800ec.png",
        "timestamp": 1538993563473,
        "duration": 13161
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "cd701335f979ffa926b7f1507d4b7ffb",
        "instanceId": 6952,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a.ghs-goToCreateAccount)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a.ghs-goToCreateAccount)\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Register.createyouraccount (D:\\e2etests\\PageObject\\SignUpPage.js:74:19)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:42:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22gwoyhthjjrith9s3xycr6h0l01538993621721%22%2C%22sessionId%22%3A%22hdcf1kxec287jmhwirh9s33gp1538993621720%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A13%3A41.720Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A13%3A42.515Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22d4d7eb2d-cae2-11e8-93e9-359e82c84415%22%2C%22v2SessionId%22%3A%22d4d83940-cae2-11e8-9bce-35534598e364%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538993625305,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538993629467,
                "type": ""
            }
        ],
        "screenShotFile": "00c3008f-0047-0040-00b1-00bf004a00c9.png",
        "timestamp": 1538993614650,
        "duration": 15208
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7716ec589f8cbcd280564fd3dcb51480",
        "instanceId": 6776,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Wait timed out after 10025ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 10025ms\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Saved.savepopularestauranthome (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:34:17)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:47:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22lw5opmk30yw8ft5orgjq7hwup1538993647480%22%2C%22sessionId%22%3A%22li5mthonicuvev1iv0re24e8l1538993647479%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A14%3A07.479Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A14%3A08.597Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22e432952d-cae2-11e8-aa64-f1c7e6dbe1e2%22%2C%22v2SessionId%22%3A%22e432bc3a-cae2-11e8-bf64-aba8e9ec9001%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538993649370,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538993652687,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538993654113,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538993663777,
                "type": ""
            }
        ],
        "screenShotFile": "00d900a5-009f-00d2-0004-006d00b400f3.png",
        "timestamp": 1538993641577,
        "duration": 35662
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "782737690333ef22a32985f1d5672561",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Wait timed out after 10008ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 10008ms\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Saved.savepopularestauranthome (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:34:17)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:47:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%221icebqw447c0wfzxmvgluisoc1538993832426%22%2C%22sessionId%22%3A%22nof3atkuy6lmkbln2vih93whz1538993832426%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A17%3A12.426Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A17%3A13.081Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22526f8f77-cae3-11e8-9c9c-151aefe5bd90%22%2C%22v2SessionId%22%3A%22526fb68c-cae3-11e8-91c3-a735ccc46948%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538993834492,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538993839715,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538993841144,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538993851058,
                "type": ""
            }
        ],
        "screenShotFile": "0031004f-00f8-006d-0057-000f008b00a0.png",
        "timestamp": 1538993825476,
        "duration": 39887
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "39bd99c7d83bdde10e5ab8c502c851fc",
        "instanceId": 6168,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Wait timed out after 10097ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 10097ms\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Saved.savepopularestauranthome (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:34:17)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:47:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%2211v0fpezu8tpo0dyzw977jkli1538993978027%22%2C%22sessionId%22%3A%22h4botl02sv01pcph5ocfnsa0d1538993978026%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A19%3A38.026Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A19%3A38.958Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22a9385b77-cae3-11e8-9c38-d18639d344cc%22%2C%22v2SessionId%22%3A%22a938828e-cae3-11e8-8cad-6f3f80553e9e%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538993980008,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538993984392,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538993985569,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538993995046,
                "type": ""
            }
        ],
        "screenShotFile": "00d1009f-006a-00c6-001a-00cc00a700e8.png",
        "timestamp": 1538993971549,
        "duration": 37233
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "bab80f2ba06fb70908747e3814f9a19d",
        "instanceId": 8304,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Wait timed out after 10146ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 10146ms\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Saved.savepopularestauranthome (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:34:17)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:47:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%223wrgxxecvd5n80wxhwp0tb89f1538994033513%22%2C%22sessionId%22%3A%22l259ckfm3ev7rl3a7xqn1yfzt1538994033512%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A20%3A33.512Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-08T10%3A20%3A34.009Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22ca4ab24f-cae3-11e8-8722-43597ee2b1c9%22%2C%22v2SessionId%22%3A%22ca4ab240-cae3-11e8-9876-29846b9d6486%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538994035333,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538994040196,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538994041677,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538994051681,
                "type": ""
            }
        ],
        "screenShotFile": "00db003c-00a5-001c-007f-00c4002a0042.png",
        "timestamp": 1538994027420,
        "duration": 38019
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "e344c26f8b69f52237ab340e2bbe7345",
        "instanceId": 8468,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Wait timed out after 10061ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 10061ms\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Saved.allsavedpageresturantname (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:57:17)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:50:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:40:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22xvwhpg3g9m9n6lxpbso9qu51f1538994138400%22%2C%22sessionId%22%3A%22hfglfl2x4xurl87a5bba4pun31538994138399%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A22%3A18.399Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A22%3A19.142Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2208cf07a3-cae4-11e8-8526-e5dbc06d2807%22%2C%22v2SessionId%22%3A%2208cf55c3-cae4-11e8-a058-b7b1a5d61b8f%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538994140339,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538994144985,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538994146383,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538994156105,
                "type": ""
            }
        ],
        "screenShotFile": "006a00cb-0067-007f-00a7-0035007d001b.png",
        "timestamp": 1538994131560,
        "duration": 42665
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "8047726a18c08e1a9285c7285fb79976",
        "instanceId": 312,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22l4shklc1fmupxk8i424w011xm1538994213804%22%2C%22sessionId%22%3A%2231mm1dsy759n56x4qkivjcjus1538994213804%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A23%3A33.804Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A23%3A34.605Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2235c1128e-cae4-11e8-8131-85bc766323d8%22%2C%22v2SessionId%22%3A%2235c13994-cae4-11e8-b6ba-4fdfdc913101%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538994215767,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538994221436,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538994223213,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538994232665,
                "type": ""
            }
        ],
        "screenShotFile": "0023006b-008c-005f-0075-005900df00d0.png",
        "timestamp": 1538994207466,
        "duration": 36732
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "117aae1d502396c091da16ef4f67212a",
        "instanceId": 5864,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22xfoxfje8t9pxqbb0zuljcmdkn1538994322273%22%2C%22sessionId%22%3A%22g7swcurclf0wofffxgd23yby41538994322273%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A25%3A22.272Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A25%3A23.162Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%227667aba7-cae4-11e8-9758-a711d8e1a876%22%2C%22v2SessionId%22%3A%227667f9c0-cae4-11e8-aa64-913f74c2a176%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538994325271,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538994329267,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538994330912,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538994341074,
                "type": ""
            }
        ],
        "screenShotFile": "00b2004e-00b1-00cb-001d-005e00ba0089.png",
        "timestamp": 1538994314380,
        "duration": 38462
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "02635956f3238704b0360f4a8a4a8abc",
        "instanceId": 7752,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ay4dahfno78tnr77fxvi033621538994770355%22%2C%22sessionId%22%3A%22pqa9h8451n8a90kxw3wficq3y1538994770355%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A32%3A50.354Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A32%3A51.017Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22817bb5dd-cae5-11e8-a243-4f58f27d4b0b%22%2C%22v2SessionId%22%3A%22817c2b0a-cae5-11e8-b413-47f2f713d5d1%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538994773786,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538994776999,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538994778474,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538994788530,
                "type": ""
            }
        ],
        "screenShotFile": "00400045-0016-0085-001a-00c3007b0051.png",
        "timestamp": 1538994763144,
        "duration": 34120
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "56b4b632720244f316489edfbb5b3ca1",
        "instanceId": 7372,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: names is not defined"
        ],
        "trace": [
            "ReferenceError: names is not defined\n    at Utils.storeallelementtextintoarray (D:\\e2etests\\Protractor-Utils.js:74:9)\n    at Saved.allsavedpageresturantname (D:\\e2etests\\PageObject\\SavedRestaurantPage.js:53:27)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:51:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\nFrom: Task: Run it(\"Save restaurant in home page and verify in saved pages\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:41:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:14:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22qkqvtast0tbt4kpj0eypctenj1538995259530%22%2C%22sessionId%22%3A%22zcabxdlqng1l1f804g6m8k9ft1538995259530%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A40%3A59.530Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A41%3A00.532Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22a50e3268-cae6-11e8-abc5-297a6a5b51e9%22%2C%22v2SessionId%22%3A%22a50e8086-cae6-11e8-bac7-39bc1bc8f893%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538995261978,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538995265982,
                "type": ""
            }
        ],
        "screenShotFile": "00c000db-00b9-0091-00ad-00c6000900a6.png",
        "timestamp": 1538995252844,
        "duration": 13177
    },
    {
        "description": "Save restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "185f13c6ab36f495b3ae7efa131a33c4",
        "instanceId": 7052,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22jdjw8ek23fmnuhycsmprh56nv1538995336736%22%2C%22sessionId%22%3A%224t4ve78zuvqfy3vpxlmb63ulg1538995336735%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A42%3A16.735Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A42%3A18.251Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22d312e5ca-cae6-11e8-99c1-c3a4bc17d445%22%2C%22v2SessionId%22%3A%22d3130cd3-cae6-11e8-95e1-0fb9418b7a4a%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538995339889,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538995343373,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538995344611,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538995354778,
                "type": ""
            }
        ],
        "screenShotFile": "00c100bb-00b7-00f2-0095-00b100e90065.png",
        "timestamp": 1538995329905,
        "duration": 36709
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "dee9fc818a055477a34ff37d3a9cdf79",
        "instanceId": 8372,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22v2c5wufqiqq16afpfasnqf4xx1538996387903%22%2C%22sessionId%22%3A%22p1ajeiqduy0wth9dvmfx8o68m1538996387902%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A59%3A47.901Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T10%3A59%3A48.854Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22459dcb8e-cae9-11e8-b7ee-c110b2905803%22%2C%22v2SessionId%22%3A%22459df299-cae9-11e8-b7a3-0f8e533f2210%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538996390213,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538996395074,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538996396176,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538996406718,
                "type": ""
            }
        ],
        "screenShotFile": "009c00e0-0018-0080-00d1-00db0001001f.png",
        "timestamp": 1538996380591,
        "duration": 40221
    },
    {
        "description": "Save popular restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "dee9fc818a055477a34ff37d3a9cdf79",
        "instanceId": 8372,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22v2c5wufqiqq16afpfasnqf4xx1538996387903%22%2C%22sessionId%22%3A%22p1ajeiqduy0wth9dvmfx8o68m1538996387902%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A59%3A47.901Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T11%3A00%3A25.203Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22459dcb8e-cae9-11e8-b7ee-c110b2905803%22%2C%22v2SessionId%22%3A%22459df299-cae9-11e8-b7a3-0f8e533f2210%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538996425599,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538996434378,
                "type": ""
            }
        ],
        "screenShotFile": "00de0087-0089-00e6-00e0-00e600cc0010.png",
        "timestamp": 1538996422409,
        "duration": 22958
    },
    {
        "description": "Save closest restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "dee9fc818a055477a34ff37d3a9cdf79",
        "instanceId": 8372,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22v2c5wufqiqq16afpfasnqf4xx1538996387903%22%2C%22sessionId%22%3A%22p1ajeiqduy0wth9dvmfx8o68m1538996387902%22%2C%22sessionStartDateTime%22%3A%222018-10-08T10%3A59%3A47.901Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T11%3A00%3A49.734Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22459dcb8e-cae9-11e8-b7ee-c110b2905803%22%2C%22v2SessionId%22%3A%22459df299-cae9-11e8-b7a3-0f8e533f2210%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538996450239,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538996458830,
                "type": ""
            }
        ],
        "screenShotFile": "002d00e1-0092-00dd-00cd-009d00f20083.png",
        "timestamp": 1538996447141,
        "duration": 21542
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});
    };

    this.sortSpecs();
});

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            countLogMessages(item);

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    checkIfShouldDisplaySpecName(prevItem, item);
                    filtered.push(item);
                    prevItem = item;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    checkIfShouldDisplaySpecName(prevItem, item);
                    filtered.push(item);
                    prevItem = item;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    checkIfShouldDisplaySpecName(prevItem, item);
                    filtered.push(item);
                    prevItem = item;
                }

            }
        }

        return filtered;
    };
});

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
        return;
    }

    if (getSpec(item.description) != getSpec(prevItem.description)) {
        item.displaySpecName = true;
        return;
    }
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};
