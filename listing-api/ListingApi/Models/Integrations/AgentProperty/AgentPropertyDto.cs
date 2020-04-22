using System;
using System.ComponentModel.DataAnnotations;
using ListingApi.Models.Integrations.AgentProperty;

namespace ListingApi.Models.AgentProperty
{
    public class AgentPropertyDto
    {
        [Required]
        public string Uri { get; set; }

        [Required]
        public string CompanyUri { get; set; }

        public string PropertyActivityPeriodUri { get; set; }

        public int BedroomTotal { get; set; }

        public int MinPrice { get; set; }

        public int MaxPrice { get; set; }

        public EpcDetails Epc { get; set; }

        public HomeReport HomeReport { get; set; }

        [Required]
        public string PropertyType { get; set; }

        [Required]
        public string PropertyStyle { get; set; }

        public bool NewBuild { get; set; }

        public PropertyAddressDetails Address { get; set; }

        public DateTime? CreatedDateTime { get; set; }

        public DateTime? UpdatedDateTime { get; set; }

        public bool IsScottishProperty { get; set; }

        public AgentPropertyDto()
        {
            Epc = new EpcDetails();
            HomeReport = new HomeReport();
        }
    }
}
