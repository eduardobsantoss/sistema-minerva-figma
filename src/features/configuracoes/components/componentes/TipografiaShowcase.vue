<script setup lang="ts">
import ShowcaseSection from './ShowcaseSection.vue';
import {
  TYPOGRAPHY_SCALE,
  TYPOGRAPHY_USAGE,
  TYPOGRAPHY_WEIGHTS,
} from '../../data/typographyUsage';
</script>

<template>
  <div class="flex flex-col" style="gap: 16px">
    <ShowcaseSection
      title="Escala de tamanhos"
      description="Tokens --text-* definidos em theme.css. A base do documento é 14px."
      token="--text-micro … --text-4xl"
    >
      <div class="flex flex-col" style="gap: 14px">
        <div
          v-for="item in TYPOGRAPHY_SCALE"
          :key="item.token"
          class="flex items-baseline"
          style="gap: 16px; flex-wrap: wrap; border-bottom: 1px solid var(--border-default); padding-bottom: 12px"
        >
          <code
            style="
              width: 120px;
              flex-shrink: 0;
              font-size: var(--text-micro);
              color: var(--gci-base);
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            "
          >
            {{ item.token }}
          </code>
          <span style="width: 72px; flex-shrink: 0; font-size: var(--text-xs); color: var(--text-muted)">
            {{ item.pxApprox }}
          </span>
          <span :style="{ fontSize: `var(${item.token})`, color: 'var(--text-strong)', lineHeight: 1.3 }">
            {{ item.sample }}
          </span>
        </div>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="Pesos"
      description="Inter 400–700 via --weight-*."
      token="--weight-regular … --weight-bold"
    >
      <div class="flex flex-col" style="gap: 12px">
        <div
          v-for="w in TYPOGRAPHY_WEIGHTS"
          :key="w.token"
          class="flex items-baseline"
          style="gap: 16px"
        >
          <code
            style="
              width: 160px;
              font-size: var(--text-micro);
              color: var(--gci-base);
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            "
          >
            {{ w.token }}
          </code>
          <span
            :style="{
              fontSize: 'var(--text-lg)',
              fontWeight: `var(${w.token})`,
              color: 'var(--text-strong)',
            }"
          >
            {{ w.sample }}
          </span>
        </div>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="Onde usar"
      description="Mapa de papéis tipográficos alinhado às guidelines e telas atuais."
    >
      <div style="overflow-x: auto">
        <table style="width: 100%; border-collapse: collapse; font-size: var(--text-xs)">
          <thead>
            <tr>
              <th
                v-for="h in ['Papel', 'Tamanho', 'Peso', 'Extras', 'Onde aparece']"
                :key="h"
                style="
                  text-align: left;
                  padding: 10px 12px;
                  border-bottom: 1px solid var(--border-default);
                  color: var(--text-muted);
                  font-weight: var(--weight-bold);
                  text-transform: uppercase;
                  letter-spacing: 0.08em;
                  font-size: 10px;
                "
              >
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in TYPOGRAPHY_USAGE" :key="row.role">
              <td style="padding: 12px; border-bottom: 1px solid var(--border-default); color: var(--text-strong); font-weight: var(--weight-semibold)">
                {{ row.role }}
              </td>
              <td style="padding: 12px; border-bottom: 1px solid var(--border-default); color: var(--text-default); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: var(--text-micro)">
                {{ row.sizeToken }}
              </td>
              <td style="padding: 12px; border-bottom: 1px solid var(--border-default); color: var(--text-default); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: var(--text-micro)">
                {{ row.weightToken }}
              </td>
              <td style="padding: 12px; border-bottom: 1px solid var(--border-default); color: var(--text-muted); line-height: 1.45">
                {{ row.extras }}
              </td>
              <td style="padding: 12px; border-bottom: 1px solid var(--border-default); color: var(--text-default); line-height: 1.45">
                {{ row.where }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ShowcaseSection>
  </div>
</template>
