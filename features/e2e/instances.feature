@javascript
Feature: Instances
  Background:
    Given I visit domain path "identity/home"
    And I log in as test_user
    And I am redirected to domain path "identity/home"

  Scenario: The Instances page is reachable
    When I visit project path "compute/instances"
    Then the page status code is successful
    And I see "Create new" button
    When I click on "Create new"
    Then the page status code is successful
    And I see "Max count"

