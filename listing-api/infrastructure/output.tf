output "mi_clientId" {
    value = module.identity.application_managed_identity.client_id
}

output "mi_resourceId" {
    value = module.identity.application_managed_identity.id
}