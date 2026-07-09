package kz.kmg.dmaic.service;

import org.springframework.stereotype.Service;

@Service
public class BarrelService {

    public int calculateBarrels(Integer score) {
        if (score == null) return 0;
        if (score == 100) return 5;
        if (score >= 80)  return 4;
        if (score >= 50)  return 2;
        if (score >= 40)  return 1;
        return 0;
    }

    public String calculateReward(int totalBarrels) {
        if (totalBarrels >= 16) return "JAPAN_TRIP";
        if (totalBarrels >= 12) return "LEADERSHIP_AWARD";
        if (totalBarrels >= 8)  return "BRANDED_MERCH";
        return "PROJECT_BADGE";
    }
}
