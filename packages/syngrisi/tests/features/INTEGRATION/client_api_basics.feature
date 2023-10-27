Feature: Client API Basics

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver

  Scenario: Start, Stop Session, create check
    When I execute WDIODriver "startTestSession" method with params:
    """
    {
        "params": {
            "app": "project-name",
            "branch": "branch-name",
            "tags": ["tag1", "tag2", "tag3"],
            "browserVersion": "123",
            "test": "test-name",
            "suite": "suite-name",
            "run": "run-name",
            "runident": "test-run-ident"
        }
    }
    """

    Then I expect WDIODriver "startTestSession" return value match object:
    """
    {
        "name": "test-name",
        "status": "Running",
        "browserName": "chrome [HEADLESS]",
        "browserVersion": "123",
        "branch": "branch-name",
        "tags": [
            "tag1",
            "tag2",
            "tag3"
        ],
        "viewport": "1366x768",
        "os": "macOS",
        "checks": []
    }
    """

    When I execute WDIODriver "check" method with params:
    """
    {
        "checkName": "check-name",
        "filePath": "./files/A.png",
        "params": {
            "checkName": "check-name",
            "viewport": "500x500",
            "browserName": "safari",
            "os": "Windows",
            "browserVersion": 2,
            "browserFullVersion": "1.2.3.4"
        }
    }
    """
    Then I expect WDIODriver "check" return value match object:
    """
     {
        "name": "check-name",
        "test": "<startTestSession: _id>",
        "suite": "<startTestSession: suite>",
        "app": "<startTestSession: app>",
        "branch": "branch-name",
        "status": [
            "new"
        ],
        "browserName": "safari",
        "browserVersion": "2",
        "browserFullVersion": "1.2.3.4",
        "viewport": "500x500",
        "os": "Windows",
        "result": "{}",
        "run": "<startTestSession: run>",
        "creatorUsername": "Guest",
        "failReasons": []
    }
    """

    When I execute WDIODriver "stopTestSession" method with params:
    """
    {}
    """

    Then I expect WDIODriver "stopTestSession" return value match object:
    """
     {
        "_id": "<startTestSession: _id>",
        "name": "test-name",
        "status": "Running",
        "browserName": "chrome [HEADLESS]",
        "browserVersion": "123",
        "branch": "branch-name",
        "tags": [
            "tag1",
            "tag2",
            "tag3"
        ],
        "viewport": "1366x768",
        "os": "macOS",
        "app": "<startTestSession: app>",
        "blinking": 0,
        "checks": ["<check: _id>"],
        "suite": "<startTestSession: suite>",
        "run": "<startTestSession: run>",
        "calculatedStatus": "New"
    }
    """

  Scenario: Baseline with same snapshots hashcode exist - [baseline: 'found', snapshot: 'not found'] (not accepted)
    Given I create "1" tests with:
    """
      testName: TestName
      project: ProjectName
      branch: BranchName
      checks:
          - checkName: check-name
            viewport: 500x500
            browserName: safari
            os: Windows
            browserVersion: 1.0
            browserFullVersion: 1.0.111.1
            filePath: files/A.png
    """

    When I wait for "5" seconds
    When I execute WDIODriver "checkIfBaselineExist" method with params:
    """
    {
        "params": {
            "name": "check-name",
            "viewport": "500x500",
            "browserName": "safari",
            "os": "Windows",
            "app": "ProjectName",
            "branch": "BranchName"
        },
        "filePath": "files/A.png"
    }
    """
    Then I expect WDIODriver "checkIfBaselineExist" return value match object:
    """
    {
       "baselineFound": false,
       "snapshotFound": false
    }
    """

  Scenario: Baseline with same snapshots hashcode exist - [baseline: 'found', snapshot: 'not found'] (different image)
    Given I create "1" tests with:
    """
      testName: TestName
      project: ProjectName
      branch: BranchName
      checks:
          - checkName: check-name
            viewport: 500x500
            browserName: safari
            os: Windows
            browserVersion: 1.0
            browserFullVersion: 1.0.111.1
            filePath: files/A.png
    """
    When I accept via http the 1st check with name "check-name"

    When I wait for "5" seconds
    When I execute WDIODriver "checkIfBaselineExist" method with params:
    """
    {
        "params": {
            "name": "check-name",
            "viewport": "500x500",
            "browserName": "safari",
            "os": "Windows",
            "app": "ProjectName",
            "branch": "BranchName"
        },
        "filePath": "files/B.png"
    }
    """
    Then I expect WDIODriver "checkIfBaselineExist" return value match object:
    """
    {
       "baselineFound": true,
       "snapshotFound": false
    }
    """

  Scenario: Baseline with same snapshots hashcode exist - success
    Given I create "1" tests with:
    """
      testName: TestName
      project: ProjectName
      branch: BranchName
      checks:
          - checkName: check-name
            viewport: 500x500
            browserName: safari
            os: Windows
            browserVersion: 1.0
            browserFullVersion: 1.0.111.1
            filePath: files/A.png
    """
    When I accept via http the 1st check with name "check-name"

    When I wait for "5" seconds
    When I execute WDIODriver "checkIfBaselineExist" method with params:
    """
    {
        "params": {
            "name": "check-name",
            "viewport": "500x500",
            "browserName": "safari",
            "os": "Windows",
            "app": "ProjectName",
            "branch": "BranchName"
        },
        "filePath": "files/A.png"
    }
    """
    Then I expect WDIODriver "checkIfBaselineExist" return value match object:
    """
    {
       "baselineFound": true,
       "snapshotFound": true
    }
    """

  Scenario: Baseline with same snapshots hashcode exist - not found (different name)
    Given I create "1" tests with:
    """
      testName: TestName
      project: ProjectName
      branch: BranchName
      checks:
          - checkName: check-name
            viewport: 500x500
            browserName: safari
            os: Windows
            browserVersion: 1.0
            browserFullVersion: 1.0.111.1
            filePath: files/A.png
    """
    When I accept via http the 1st check with name "check-name"

    When I wait for "5" seconds
    When I execute WDIODriver "checkIfBaselineExist" method with params:
    """
    {
        "params": {
            "name": "check-name_1",
            "viewport": "500x500",
            "browserName": "safari",
            "os": "Windows",
            "app": "ProjectName",
            "branch": "BranchName"
        },
        "filePath": "files/A.png"
    }
    """
    Then I expect WDIODriver "checkIfBaselineExist" return value match object:
    """
    {
       "baselineFound": false,
       "snapshotFound": false
    }
    """