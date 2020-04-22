terraform {   
    backend "azurerm" {     
    } 
}

module "identity" {
  source = "../global-modules/managed-identity" 

  app_name = "listing-api"
  domain_name = "Listing"
  env_name = "Staging"
}