# script to create a spreadsheet with decrypted email addresses

library(tidyr)
library(dplyr)
emails <- read.csv("~/Documents/Research/polgrice_GIT/experiment/exp_versions/12_Korea/polgrice_results_G_test.csv") %>%
  select(email)

